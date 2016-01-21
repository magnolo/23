<?php

namespace App\Http\Controllers;

use Hash;
use Config;
use Validator;
use Illuminate\Http\Request;

use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use \GuzzleHttp;
use \GuzzleHttp\Subscriber\Oauth\Oauth1;
use \Firebase\JWT\JWT;

use App\User;

class AuthenticateController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['postAuth', 'postFacebook', 'postGoogle']]);
    }

    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function getData()
    {
        //auth protected data
        return ['auth', 'protected', 'data'];
    }
    protected function createToken($user)
    {
        $payload = [
            'sub' => $user->id,
            'iat' => time(),
            'exp' => time() + (2 * 7 * 24 * 60 * 60)
        ];
        return JWT::encode($payload, Config::get('app.token_secret'));
    }

    /**
     * Unlink provider.
     */
    public function unlink(Request $request, $provider)
    {
        $user = User::find($request['user']['sub']);
        if (!$user)
        {
            return response()->json(['message' => 'User not found']);
        }
        $user->$provider = '';
        $user->save();

        return response()->json(array('token' => $this->createToken($user)));
    }
    public function postAuth(Request $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            // verify the credentials and create a token for the user
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'invalid_credentials'], 401);
            }
        } catch (JWTException $e) {
            // something went wrong
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        // if no errors are encountered we can return a JWT
        return compact('token');
    }
    public function signup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'displayName' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->messages()], 400);
        }
        $user = new User;
        $user->displayName = $request->input('displayName');
        $user->email = $request->input('email');
        $user->password = Hash::make($request->input('password'));
        $user->save();
        return response()->json(['token' => $this->createToken($user)]);
    }
    public function postFacebook(Request $request)
    {
        $client = new GuzzleHttp\Client();
        $params = [
            'code' => $request->input('code'),
            'client_id' => $request->input('clientId'),
            'redirect_uri' => $request->input('redirectUri'),
            'client_secret' => Config::get('app.facebook_secret')
        ];
        // Step 1. Exchange authorization code for access token.
        $accessTokenResponse = $client->request('GET', 'https://graph.facebook.com/v2.5/oauth/access_token', [
            'query' => $params
        ]);
        $accessToken = json_decode($accessTokenResponse->getBody(), true);
        // Step 2. Retrieve profile information about the current user.
        $fields = 'id,email,first_name,last_name,link,name';
        $profileResponse = $client->request('GET', 'https://graph.facebook.com/v2.5/me', [
            'query' => [
                'access_token' => $accessToken['access_token'],
                'fields' => $fields
            ]
        ]);
        $profile = json_decode($profileResponse->getBody(), true);
        // Step 3a. If user is already signed in then link accounts.
        if ($request->header('Authorization'))
        {
            $user = User::where('facebook', '=', $profile['id']);
            if ($user->first())
            {
                return response()->json(['message' => 'There is already a Facebook account that belongs to you'], 409);
            }
            $token = explode(' ', $request->header('Authorization'))[1];
            $payload = (array) JWT::decode($token, Config::get('app.token_secret'), array('HS256'));
            $user = User::find($payload['sub']);
            $user->facebook = $profile['id'];
            $user->email = $user->email ?: $profile['email'];
            $user->displayName = $user->displayName ?: $profile['name'];
            $user->save();
            return response()->json(['token' => $this->createToken($user)]);
        }
        // Step 3b. Create a new user account or return an existing one.
        else
        {
            $user = User::where('facebook', '=', $profile['id']);
            if ($user->first())
            {
                return response()->json(['token' => $this->createToken($user->first())]);
            }
            $user = new User;
            $user->facebook = $profile['id'];
            $user->email = $profile['email'];
            $user->displayName = $profile['name'];
            $user->save();
            return response()->json(['token' => $this->createToken($user)]);
        }
    }
    /**
     * Login with Google.
     */
    public function postGoogle(Request $request)
    {
        $client = new GuzzleHttp\Client();
        $params = [
            'code' => $request->input('code'),
            'client_id' => $request->input('clientId'),
            'client_secret' => Config::get('app.google_secret'),
            'redirect_uri' => $request->input('redirectUri'),
            'grant_type' => 'authorization_code',
        ];
        // Step 1. Exchange authorization code for access token.
        $accessTokenResponse = $client->request('POST', 'https://accounts.google.com/o/oauth2/token', [
            'form_params' => $params
        ]);
        $accessToken = json_decode($accessTokenResponse->getBody(), true);
        // Step 2. Retrieve profile information about the current user.
        $profileResponse = $client->request('GET', 'https://www.googleapis.com/plus/v1/people/me/openIdConnect', [
            'headers' => array('Authorization' => 'Bearer ' . $accessToken['access_token'])
        ]);
        $profile = json_decode($profileResponse->getBody(), true);
        // Step 3a. If user is already signed in then link accounts.
        if ($request->header('Authorization'))
        {
            $user = User::where('google', '=', $profile['sub']);
            if ($user->first())
            {
                return response()->json(['message' => 'There is already a Google account that belongs to you'], 409);
            }
            $token = explode(' ', $request->header('Authorization'))[1];
            $payload = (array) JWT::decode($token, Config::get('app.token_secret'), array('HS256'));
            $user = User::find($payload['sub']);
            $user->google = $profile['sub'];
            $user->displayName = $user->displayName ?: $profile['name'];
            $user->save();
            return response()->json(['token' => $this->createToken($user)]);
        }
        // Step 3b. Create a new user account or return an existing one.
        else
        {
            $user = User::where('google', '=', $profile['sub']);
            if ($user->first())
            {
                return response()->json(['token' => $this->createToken($user->first())]);
            }
            $user = new User;
            $user->google = $profile['sub'];
            $user->displayName = $profile['name'];
            $user->save();
            return response()->json(['token' => $this->createToken($user)]);
        }
    }
    /**
     * Login with Twitter.
     */
    public function twitter(Request $request)
    {
        $stack = GuzzleHttp\HandlerStack::create();
        // Part 1 of 2: Initial request from Satellizer.
        if (!$request->input('oauth_token') || !$request->input('oauth_verifier'))
        {
            $stack = GuzzleHttp\HandlerStack::create();
            $requestTokenOauth = new Oauth1([
              'consumer_key' => Config::get('app.twitter_key'),
              'consumer_secret' => Config::get('app.twitter_secret'),
              'callback' => $request->input('redirectUri'),
              'token' => '',
              'token_secret' => ''
            ]);
            $stack->push($requestTokenOauth);
            $client = new GuzzleHttp\Client([
                'handler' => $stack
            ]);
            // Step 1. Obtain request token for the authorization popup.
            $requestTokenResponse = $client->request('POST', 'https://api.twitter.com/oauth/request_token', [
                'auth' => 'oauth'
            ]);
            $oauthToken = array();
            parse_str($requestTokenResponse->getBody(), $oauthToken);
            // Step 2. Send OAuth token back to open the authorization screen.
            return response()->json($oauthToken);
        }
        // Part 2 of 2: Second request after Authorize app is clicked.
        else
        {
            $accessTokenOauth = new Oauth1([
                'consumer_key' => Config::get('app.twitter_key'),
                'consumer_secret' => Config::get('app.twitter_secret'),
                'token' => $request->input('oauth_token'),
                'verifier' => $request->input('oauth_verifier'),
                'token_secret' => ''
            ]);
            $stack->push($accessTokenOauth);
            $client = new GuzzleHttp\Client([
                'handler' => $stack
            ]);
            // Step 3. Exchange oauth token and oauth verifier for access token.
            $accessTokenResponse = $client->request('POST', 'https://api.twitter.com/oauth/access_token', [
                'auth' => 'oauth'
            ]);
            $accessToken = array();
            parse_str($accessTokenResponse->getBody(), $accessToken);
            $profileOauth = new Oauth1([
                'consumer_key' => Config::get('app.twitter_key'),
                'consumer_secret' => Config::get('app.twitter_secret'),
                'oauth_token' => $accessToken['oauth_token'],
                'token_secret' => ''
            ]);
            $stack->push($profileOauth);
            $client = new GuzzleHttp\Client([
                'handler' => $stack
            ]);
            // Step 4. Retrieve profile information about the current user.
            $profileResponse = $client->request('GET', 'https://api.twitter.com/1.1/users/show.json?screen_name=' . $accessToken['screen_name'], [
                'auth' => 'oauth'
            ]);
            $profile = json_decode($profileResponse->getBody(), true);
            // Step 5a. Link user accounts.
            if ($request->header('Authorization'))
            {
                $user = User::where('twitter', '=', $profile['id']);
                if ($user->first())
                {
                    return response()->json(['message' => 'There is already a Twitter account that belongs to you'], 409);
                }
                $token = explode(' ', $request->header('Authorization'))[1];
                $payload = (array) JWT::decode($token, Config::get('app.token_secret'), array('HS256'));
                $user = User::find($payload['sub']);
                $user->twitter = $profile['id'];
                $user->displayName = $user->displayName ?: $profile['screen_name'];
                $user->save();
                return response()->json(['token' => $this->createToken($user)]);
            }
            // Step 5b. Create a new user account or return an existing one.
            else
            {
                $user = User::where('twitter', '=', $profile['id']);
                if ($user->first())
                {
                    return response()->json(['token' => $this->createToken($user->first())]);
                }
                $user = new User;
                $user->twitter = $profile['id'];
                $user->displayName = $profile['screen_name'];
                $user->save();
                return response()->json(['token' => $this->createToken($user)]);
            }
        }
    }
}

<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('items', function (Blueprint $table) {
          $table->increments('id');
          $table->integer('parent_id')->nullable()->undsigned()->default(null);
          $table->integer('indicator_id')->nullable();
          $table->integer('user_id');
          $table->integer('style_id')->default(0);
          $table->string('name');
          $table->string('title');
          $table->text('description')->nullable();
          $table->text('caption')->nullable();
          $table->integer('weight')->nullable();
          $table->integer('item_type_id')->default(0);
          $table->boolean('is_published')->default(false);
          $table->boolean('is_official')->default(false);
          $table->softDeletes();
          $table->timestamps();
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('items');
    }
}

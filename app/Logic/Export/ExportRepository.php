<?php
namespace App\Logic\Export{

  use App\Export;
  use App\Exportitem;
  use App\Style;
  use App\Countrie;


  class ExportRepository{

      public function saveItems(Export $export, $items, $parent = null){
        foreach($items as $item){
          $exportitem = new Exportitem;
          $exportitem->type = $item['type'];
          $exportitem->title = $item['title'];
          $exportitem->name = str_slug($exportitem->title);
          if(isset($item['image_id'])) $exportitem->image_id = $item['image_id'];
          if(isset($item['description'])) $exportitem->description = $item['description'];


          if(isset($item['style'])){
            $style = new Style;
            $style->title = "Export: ".$export->title;
            $style->name = str_slug($style->title);

            if(isset($item['style']['basemap_id'])) $style->basemap_id = $item['style']['basemap_id'];
            if(isset($item['style']['base_color'])) $style->base_color = $item['style']['base_color'];
            if(isset($item['style']['fixed_title'])) $style->fixed_title = $item['style']['fixed_title'];
            if(isset($item['style']['fixed_description']))$style->fixed_description = $item['style']['fixed_description'];
            if(isset($item['style']['search_box']))$style->search_box = $item['style']['search_box'];
            if(isset($item['style']['share_options']))$style->share_options = $item['style']['share_options'];
            if(isset($item['style']['zoom_controls']))$style->zoom_controls = $item['style']['zoom_controls'];
            if(isset($item['style']['scroll_wheel_zoom']))$style->scroll_wheel_zoom = $item['style']['scroll_wheel_zoom'];
            if(isset($item['style']['legends']))$style->legends = $item['style']['legends'];
            if(isset($item['style']['layer_selection']))$style->layer_selection = $item['style']['layer_selection'];
            if(isset($item['style']['full_screen']))$style->full_screen = $item['style']['full_screen'];
            if(isset($item['style']['image_id']))$style->image_id = $item['style']['image_id'];

            $style->save();

            if(isset($item['style']['countries'])){
              foreach($item['style']['countries'] as $country){

                $style->countries()->save(Countrie::find($country['id']));
              }
            }

            $exportitem->style_id = $style->id;
          }
          if($item['type'] == "indicator"){
            $exportitem->indicator_id = $item['indicator_id'];
          }
          else{
            if(!empty($item['children'])){
              if(count($item['children'])){
                $exportitem->save();
                $this->saveItems($export, $item['children'], $exportitem);
              }
            }
          }
          if(!is_null($parent)){
            $exportitem->parent_id = $parent->id;
            $exportitem->save();
          }
          else{
            $export->items()->save($exportitem);
          }

        }
        return $export;
      }
  }
}

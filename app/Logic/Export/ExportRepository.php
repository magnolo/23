<?php
namespace App\Logic\Export{

  use App\Export;
  use App\Exportitem;
  use App\Style;


  class ExportRepository{

      public function saveItems(Export $export, $items, $parent = null){
        foreach($items as $item){
          $exportitem = new Exportitem;
          $exportitem->type = $item['type'];
          $exportitem->title = $item['title'];
          $exportitem->name = str_slug($exportitem->title);

          if($item['type'] == "indicator"){
            $exportitem->indicator_id = $item['indicator_id'];
            if($item['style']){
              $style = new Style;
              $style->title = "Export: ".$export->title;
              $style->name = str_slug($style->title);
              $style->basemap_id = $item['style']['basemap_id'];
              if(isset($item['style']['base_color'])){
                $style->base_color = $item['style']['base_color'];
              }
              else{
                $style->base_color = "rgba(128, 243, 198,1)";
              }
              $style->fixed_title = $item['style']['fixed_title'];
              $style->fixed_description = $item['style']['fixed_description'];
              $style->search_box = $item['style']['search_box'];
              $style->share_options = $item['style']['share_options'];
              $style->zoom_controls = $item['style']['zoom_controls'];
              $style->scroll_wheel_zoom = $item['style']['scroll_wheel_zoom'];
              $style->legends = $item['style']['legends'];
              $style->layer_selection = $item['style']['layer_selection'];
              $style->full_screen = $item['style']['full_screen'];
              $style->save();
              $exportitem->style_id = $style->id;
            }
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

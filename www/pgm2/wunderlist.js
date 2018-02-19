if (typeof wunderlist_checkVar === 'undefined') {
  
  var wunderlist_checkVar=1;
  
  var req = new XMLHttpRequest();
  req.open('GET', document.location, false);
  req.send(null);
  var csrfToken = req.getResponseHeader('X-FHEM-csrfToken');
  
  var wunderlist_icon={};
  
  var wunderlist_svgPrefix='<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path ';
  
  wunderlist_icon.ref=wunderlist_svgPrefix+'d="M440.935 12.574l3.966 82.766C399.416 41.904 331.674 8 256 8 134.813 8 33.933 94.924 12.296 209.824 10.908 217.193 16.604 224 24.103 224h49.084c5.57 0 10.377-3.842 11.676-9.259C103.407 137.408 172.931 80 256 80c60.893 0 114.512 30.856 146.104 77.801l-101.53-4.865c-6.845-.328-12.574 5.133-12.574 11.986v47.411c0 6.627 5.373 12 12 12h200.333c6.627 0 12-5.373 12-12V12c0-6.627-5.373-12-12-12h-47.411c-6.853 0-12.315 5.729-11.987 12.574zM256 432c-60.895 0-114.517-30.858-146.109-77.805l101.868 4.871c6.845.327 12.573-5.134 12.573-11.986v-47.412c0-6.627-5.373-12-12-12H12c-6.627 0-12 5.373-12 12V500c0 6.627 5.373 12 12 12h47.385c6.863 0 12.328-5.745 11.985-12.599l-4.129-82.575C112.725 470.166 180.405 504 256 504c121.187 0 222.067-86.924 243.704-201.824 1.388-7.369-4.308-14.176-11.807-14.176h-49.084c-5.57 0-10.377 3.842-11.676 9.259C408.593 374.592 339.069 432 256 432z"/></svg>';
  wunderlist_icon.del=wunderlist_svgPrefix+'d="M0 84V56c0-13.3 10.7-24 24-24h112l9.4-18.7c4-8.2 12.3-13.3 21.4-13.3h114.3c9.1 0 17.4 5.1 21.5 13.3L312 32h112c13.3 0 24 10.7 24 24v28c0 6.6-5.4 12-12 12H12C5.4 96 0 90.6 0 84zm416 56v324c0 26.5-21.5 48-48 48H80c-26.5 0-48-21.5-48-48V140c0-6.6 5.4-12 12-12h360c6.6 0 12 5.4 12 12zm-272 68c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208zm96 0c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208zm96 0c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208z"/></svg>';
  wunderlist_icon.loading='<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" viewBox="0 0 128 128" xml:space="preserve"><g transform="rotate(-32.1269 64 64)"><path d="M78.75 16.18V1.56a64.1 64.1 0 0 1 47.7 47.7H111.8a49.98 49.98 0 0 0-33.07-33.08zM16.43 49.25H1.8a64.1 64.1 0 0 1 47.7-47.7V16.2a49.98 49.98 0 0 0-33.07 33.07zm33.07 62.32v14.62A64.1 64.1 0 0 1 1.8 78.5h14.63a49.98 49.98 0 0 0 33.07 33.07zm62.32-33.07h14.62a64.1 64.1 0 0 1-47.7 47.7v-14.63a49.98 49.98 0 0 0 33.08-33.07z" fill-opacity="1"/><animateTransform attributeName="transform" type="rotate" from="0 64 64" to="-90 64 64" dur="1800ms" repeatCount="indefinite"/></g></svg>';

  function wunderlist_encodeParm(oldVal) {
      var newVal;
      newVal = oldVal.replace(/\$/g, '\\%24');
      newVal = newVal.replace(/"/g, '%27');
      newVal = newVal.replace(/#/g, '%23');
      newVal = newVal.replace(/\+/g, '%2B');
      newVal = newVal.replace(/&/g, '%26');
      newVal = newVal.replace(/'/g, '%27');
      newVal = newVal.replace(/=/g, '%3D');
      newVal = newVal.replace(/\?/g, '%3F');
      newVal = newVal.replace(/\|/g, '%7C');
      newVal = newVal.replace(/\s/g, '%20');
      return newVal;
  };

  function wunderlist_dialog(message,title) {
      if (typeof title === 'undefined') title="Message";
      $('<div></div>').appendTo('body').html('<div>' + message + '</div>').dialog({
          modal: true, title: 'wunderlist '+title, zIndex: 10000, autoOpen: true,
          width: 'auto', resizable: false,
          buttons: {
              OK: function () {
                  $(this).dialog("close");
              }
          },
          close: function (event, ui) {
              $(this).remove();
          }
      });
      setTimeout(function(){
        $('.ui-dialog').remove();
      },10000);
  };
  
  function wunderlist_refreshTable(name,sortit) {
    var i=1;
    $('#wunderlistTable_' + name).find('tr.wunderlist_data').each(function() {
      // order
      var tid = $(this).attr("data-line-id");
      $(this).removeClass("odd even");
      if (i%2==0) $(this).addClass("even");
      else $(this).addClass("odd");
      if (typeof sortit != 'undefined') wunderlist_sendCommand('set ' + name + ' updateTask ID:'+ tid + ' order="' + i + '"');
      i++;
    });
    if (i!=1) $('#wunderlistTable_' + name).find("tr.wunderlist_ph").hide();
    if (i==1) $('#wunderlistTable_' + name).find("tr.wunderlist_ph").show();
    refreshInput(name);
    refreshInputs(name);
    wunderlist_removeLoading(name);
  }
  
  function wunderlist_refreshTableWidth() {
    $('.sortable').each(function() {
      $(this).css('width','');
    });
  }
  
  function wunderlist_reloadTable(name,val) {
    var wunderlist_small = (screen.width < 480 || screen.height < 480);
    $('#wunderlistTable_' + name).find('tr.wunderlist_data').remove();
    $('#wunderlistTable_' + name).find('#newEntry_'+name).parent().parent().before(val);
    wunderlist_refreshTable(name);
    if (!wunderlist_small) $('#newEntry_' + name).focus();
  }
  
  function refreshInputs(name) {
    $('#wunderlistTable_' + name).find('tr.wunderlist_data').find('td.wunderlist_input').find('input[type=text]').each(function() {
      var w = $(this).prev('span').width()+5;
      $(this).width(w); 
    });
  }
  
  function refreshInput(name) {
    $('#newEntry_'+name).width(0);
    var w = $('#newEntry_'+name).parent('td').width()-4;
    $('#newEntry_'+name).width(w); 
  }

  function wunderlist_sendCommand(cmd) {
    var name = cmd.split(" ")[1];
    wunderlist_addLoading(name);
    var location = document.location.pathname;
    if (location.substr(location.length -1, 1) == '/') {
        location = location.substr(0, location.length -1);
    }
    var url = document.location.protocol + "//" + document.location.host + location;
    FW_cmd(url + '?XHR=1&fwcsrf=' + csrfToken + '&cmd.' + name + '=' + cmd);
  }
  
  function wunderlist_addLoading(name) {
    if ( $('.wunderlist_devType_' + name).find('.wunderlist_loadingDiv').length ) {
      $('.wunderlist_devType_' + name).find('.wunderlist_loadingDiv').remove();
    }
    else {
      $('.wunderlist_devType_' + name).append('<div class="wunderlist_icon wunderlist_loadingDiv">' + wunderlist_icon.loading + '</div>');
      setTimeout(function(){ 
        wunderlist_removeLoading(name);
      }, 10000);
    }
  }
  
  function wunderlist_removeLoading(name) {
    $('.wunderlist_devType_' + name).find('.wunderlist_loadingDiv').remove();
  }

  function wunderlist_ErrorDialog(name,text,title) {
    wunderlist_dialog(text,title);
    wunderlist_removeLoading(name);
  }

  function wunderlist_removeLine(name,id) {
    var i=1;
    $('#wunderlistTable_' + name).find('tr.wunderlist_data').each(function() {
      var tid = $(this).attr("data-line-id");
      if (tid==id) $(this).remove();
      else {
        $(this).removeClass("odd even");
        if (i%2==0) $(this).addClass("even");
        else $(this).addClass("odd");
        i++;
      }
    });
    if (i==1) $('#wunderlistTable_' + name).find("tr.wunderlist_ph").show();
    wunderlist_refreshTable(name);
    wunderlist_getSizes();
  }

  function wunderlist_addLine(name,id,title) {
    var lastEl=$('#wunderlistTable_' + name).find('tr').last();
    var prevEl=$(lastEl).prev('tr');
    var cl="odd";
    if (prevEl != 'undefined') {
      cl = $(prevEl).attr('class');
      if (cl=="odd") cl="even";
      else cl="odd"
    }
    $(lastEl).before('<tr id="'+ name + "_" + id +'" data-data="true" data-line-id="' + id +'" class="sortit wunderlist_data ' + cl +'">\n' +
              ' <td class="col1  wunderlist_col1">\n'+
              '   <div class=\"wunderlist_move\"></div>\n'+
              '   <input title=\"' + wunderlist_tt.check + '\" class="wunderlist_checkbox_' + name + '" type="checkbox" id="check_' + id + '" data-id="' + id + '" />\n'+
              ' </td>\n' +
              ' <td class="col1 wunderlist_input">\n'+
              '   <span class="wunderlist_task_text" data-id="' + id + '">' + title + '</span>\n'+
              '   <input type="text" data-id="' + id + '" style="display:none;" class="wunderlist_input_' + name +'" value="' + title + '" />'+
              ' </td>\n' +
              ' <td class="col2 wunderlist_delete">\n' +
              '   <a title=\"' + wunderlist_tt.delete + '\" href="#" class="wunderlist_delete_' + name + '" data-id="' + id +'">\n'+
              '     x\n'+
              '   </a>\n'+
              ' </td>\n'+
              '</tr>\n'
    );
    $('#wunderlistTable_' + name).find("tr.wunderlist_ph").hide();
    wunderlist_getSizes();
    wunderlist_refreshTable(name);
  }
  
  function resizable (el, factor) {
    var int = Number(factor) || 7.7;
    function resize() {el.style.width = ((el.value.length+1) * int) + 'px'}
    var e = 'keyup,keypress,focus,blur,change'.split(',');
    for (var i in e) el.addEventListener(e[i],resize,false);
    resize();
  }

  
  function wunderlist_getSizes() {
    var height = 0;
    var width = 0;
    $('.sortable .sortit').each(function() {
      var tHeight = $(this).outerHeight();
      if (tHeight > height) height = tHeight;
    });
    $('.sortable').css('max-height',height).css('height',height);
  }
  
  function wunderlist_addHeaders() {
    $("<div class='wunderlist_refresh wunderlist_icon' title='" + wunderlist_tt.refreshList + "'> </div>").appendTo($('.wunderlist_devType')).html(wunderlist_icon.ref);
    $("<div class='wunderlist_deleteAll wunderlist_icon' title='" + wunderlist_tt.clearList + "'> </div>").appendTo($('.wunderlist_devType')).html(wunderlist_icon.del);
  }

  $(document).ready(function(){
    wunderlist_getSizes();
    wunderlist_addHeaders();
    $('.wunderlist_name').each(function() {
      var name = $(this).val();
      wunderlist_refreshTable(name);
      
      $('.wunderlist_devType_' + name).on('click','div.wunderlist_deleteAll',function(e) {
        if (confirm(wunderlist_tt.clearconfirm)) {
          wunderlist_sendCommand('set ' + name + ' clearList');
        }
      });
      $('.wunderlist_devType_' + name).on('click','div.wunderlist_refresh',function(e) {
        wunderlist_sendCommand('set ' + name + ' getTasks');
      });
      
      $('#wunderlistTable_' + name).on('mouseover','.sortit',function(e) {
        $(this).find('div.wunderlist_move').addClass('wunderlist_sortit_handler');
      });
      $('#wunderlistTable_' + name).on('mouseout','.sortit',function(e) {
        $(this).find('div.wunderlist_move').removeClass('wunderlist_sortit_handler');
      });
      $('#wunderlistTable_' + name).on('blur keypress','#newEntry_' + name,function(e) {
        if (e.type!='keypress' || e.which==13) {
          e.preventDefault();
          var v=wunderlist_encodeParm($(this).val());
          if (v!="") {
            wunderlist_sendCommand('set '+ name +' addTask ' + v);
            $(this).val("");
          }
        }
      });
      $('#wunderlistTable_' + name).on('click','input[type="checkbox"]',function(e) {
        var val=$(this).attr('checked');
        if (!val) {
          var id=$(this).attr('data-id');
          wunderlist_sendCommand('set ' + name + ' completeTask ID:'+ id);
        }
      });
      $('#wunderlistTable_' + name).on('click','a.wunderlist_delete_'+name,function(e) {
        if (confirm(wunderlist_tt.delconfirm)) {
          var id=$(this).attr('data-id');
          wunderlist_sendCommand('set ' + name + ' deleteTask ID:'+ id);
        }
        return false;
      });
      $('#wunderlistTable_' + name).on('click','span.wunderlist_task_text',function(e) {
        var id = $(this).attr("data-id");
        var val=$(this).html();
        var width=$(this).width()+20;
        $(this).hide();
        $("input[data-id='" + id +"']").show().focus().val("").val(val);
      });
      $('#wunderlistTable_' + name).on('blur keypress','input.wunderlist_input_'+name,function(e) {
        if (e.type!='keypress' || e.which==13) {
          e.preventDefault();
          var val = $(this).val();
          
          var comp = $(this).prev().html();
          var id = $(this).attr("data-id");
          var val = $(this).val();
          $(this).hide();
          $("span.wunderlist_task_text[data-id='" + id +"']").show();
          if (val != "" && comp != val) {
            $("span.wunderlist_task_text[data-id='" + id +"']").html(val);
            wunderlist_sendCommand('set ' + name + ' updateTask ID:'+ id + ' title="' + val + '"');
          }
          
          if (val == "" && e.which==13) {
            if (confirm('Are you sure?')) {
              $('#newEntry_' + name).focus();
              wunderlist_sendCommand('set ' + name + ' deleteTask ID:'+ id);
            }
          }
          wunderlist_refreshTable(name);
        }
        if (e.type=='keypress') {
          resizable(this,7);
          refreshInput(name);
        }
      });
    });
    var fixHelper = function(e, ui) {  
      ui.children().each(function() {  
      console.log(e);
        $(this).width($(this).width());  
      });  
      return ui;  
    };
    $( ".wunderlist_table table.sortable" ).sortable({
      //axis: 'y',
      revert: true,
      items: "> tbody > tr.sortit",
      handle: ".wunderlist_sortit_handler",
      forceHelperSize: true,
      placeholder: "sortable-placeholder",
      connectWith: '.wunderlist_table table.sortable',
      helper: fixHelper,
      start: function( event, ui ) { 
        var width = ui.item.innerWidth();
        var height = ui.item.innerHeight();
        ui.placeholder.css("width",width).css("height",height); 
      },
      stop: function (event,ui) {
        var parent = ui.item.parent().parent();
        var id = $(parent).attr('id');
        var name = id.split(/_(.+)/)[1];
        if (ui.item.attr('data-remove')==1) ui.item.remove();
        wunderlist_refreshTable(name,1);
        wunderlist_refreshTableWidth();
      },
      remove: function (event,ui) {
        var id=ui.item.attr('data-line-id');
        var tid = ui.item.attr('id');
        var nameHT = tid.split("_");
        var lastVal = nameHT.pop();       // Get last element
        var nameH = nameHT.join("_"); 
        wunderlist_sendCommand('set ' + nameH + ' deleteTask ID:'+ id);
      },
      over: function (event,ui) {
        var width = ui.item.innerWidth();
        var height = ui.item.innerHeight();
        var hwidth = ui.placeholder.innerWidth();
        if (width>hwidth) ui.placeholder.parent().parent().css("width",width).css("height",height); 
        if (width<hwidth) ui.item.css("width",hwidth).css("height",height); 
      },
      out: function (event,ui) { 
        var parent = ui.sender;
        var id = $(parent).attr('id');
        var name = id.split(/_(.+)/)[1];
        $(parent).css('width','');
        refreshInput(name);
        wunderlist_refreshTable(name);
        wunderlist_refreshTableWidth();
      },
      receive: function (event,ui) {
        var parent = ui.item.parent().parent();
        var id = ui.item.attr('data-line-id');
        var tid = parent.attr('id');
        var nameR = tid.split(/_(.+)/)[1];
        var value = ui.item.find('span').html();
        wunderlist_sendCommand('set '+ nameR +' addTask ' + value);
        ui.item.attr('data-remove','1');
      }
    }).disableSelection();
  });
}
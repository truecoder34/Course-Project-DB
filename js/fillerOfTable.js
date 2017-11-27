/*
При помощи AJAX без обновления всей страницы
выгружаем на сайт уже заполненую таблицу
ТАБЛИЦА СПОРТИВНОЙ ОРГАНИЗАЦИИ
*/
$(document).on('click', '#get_table', function() {
  $.post("/get_so_table", {
      //trackingCode: $("#placeForTrackNumber").val()
    },
    function(data) {
      // alert('DATA HAS GOTTEN');
      var fullTableFromDB = data; // С сервера прихложит ВСЯ таблица и пишем ее в эту переменную

      if (fullTableFromDB === "ERROR") {
        $(".table").empty();
        $(".table").append('<div class = "noInfoInTableHeader">\
       <h1>Таблица пуста</h1>\
       </div>\
       <ul >\
        <li class = "noInfoInTable"><h3>Проверьте кооректнось ввода трекинг-номера</h3></li>\
        <li class = "noInfoInTable"><h3>Если, введеный трекинг-номер - корректен, информация о грузе еще не добавлена на сайт. Повторите запрос позже.</h3></li>\
      </ul>\
       ')
      }

      else {
        console.log(fullTableFromDB);
        $(".table").empty();
        $('.table').append('<tr class = "yesInfoInTable">\
      <th class="text-center">\
        #\
      </th>\
      <th class="text-center">\
        ID\
      </th>\
      <th class="text-center">\
        Name\
      </th>\
      <th class="text-center">\
        Registration number\
      </th>\
      <th class="text-center">\
        Adress\
      </th>\
      <th class="text-center">\
        Quantity of members\
      </th>\
      <th class="text-center">\
        Quantity of sections\
      </th>\
      </th>\
      <th class="text-center">\
        Quantity of sport groups\
      </th>\
      </th>\
      <th class="text-center">\
        Financing type\
      </th>\
    </tr>')
        fullTableFromDB.forEach(function(el, index) {
          $('.table').append('<tr class = "addedRows">\
      <td>' + Number(Number(index)+Number(1))  + '</td>\
      <td>' + el.id  + '</td>\
      <td>' + el.name_SO + '</td>\
      <td>' + el.number_SO + '</td>\
      <td>' + el.adress_SO + '</td>\
      <td>' + el.quantity_of_members + '</td>\
      <td>' + el.quantity_of_sections + '</td>\
      <td>' + el.quantity_of_groups + '</td>\
      <td>' + el.financ_type + '</td>\
      </tr>')
        })
      }

    }
  );
});

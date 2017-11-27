var row; // Переменная для записи ряда, на который мы нажали
$(document).ready(function() { // Функции данного блока выполнятся только при подгрузке таблицы
  //Функция заполнения формы РЕДАКТИРОВАНИЯ данными, из выбранной записи в ТАБЛИЦЕ
  $(document).on("click", ".table tbody tr", function() {
    row = $(this).find("td:eq(0)").html();
    //$(this).find
    $("[name='edit_name']").val($(this).find("td:eq(2)").html());
    $("[name='edit_number']").val($(this).find("td:eq(3)").html());
    $("[name='edit_adress']").val($(this).find("td:eq(4)").html());
    $("[name='edit_quantity_of_mem']").val($(this).find("td:eq(5)").html());
    $("[name='edit_quantity_of_sec']").val($(this).find("td:eq(6)").html());
    $("[name='edit_quantity_of_sg']").val($(this).find("td:eq(7)").html());
    $("[name='edit_fin_type']").val($(this).find("td:eq(8)").html());
  })
  // По клику на конпку сохранить изменения
  $(document).on('click', '#save_changes', function() {
    // Ajax POST запрос update_note
    $.post("/update_note", {
        id: $(".table tbody tr:eq(" + row + ") td:eq(1)").text(),
        input_name: $("[name='edit_name']").val(),
        input_number: $("[name='edit_number']").val(),
        input_adress: $("[name='edit_adress']").val(),
        input_quantity_of_mem: $("[name='edit_quantity_of_mem']").val(),
        input_quantity_of_sec: $("[name='edit_quantity_of_sec']").val(),
        input_quantity_of_sg: $("[name='edit_quantity_of_sg']").val(),
        input_fin_type: $("[name='edit_fin_type']").val()
      },
      function(data) {
        alert("Note edited succesfully");
      })
  })
//По клику на кнопку удалить выбранную в таблице запись
 $(document).on('click', '#delete_row', function() {
   $.post("/delete_note", {
     id: $(".table tbody tr:eq(" + row + ") td:eq(1)").text(),
   },
   function(data){
       alert("Note removed succesfully");
   })
 })
})

// Вывести Спортивные организации

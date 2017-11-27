var mysql = require("mysql");
var express = require("express");
app = express();
var bodyParser = require("body-parser");
var ejs = require("ejs");

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(__dirname + "/templates"));
app.use(express.static(__dirname)); // Путь относительно которого нудно искать наши файлы. Задаем папку в которой искать файлики


//Херня для ejs
var engines = require('consolidate');
app.set('views', __dirname + '/templates');
app.engine('html', engines.mustache);
app.set('view engine', 'ejs');


// Непосредственно блок подсоединения базы данных sql
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ""
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
/*-----Конец блока подкдючения к sql------*/


/*----Блок подключения непосредственно к нашей базе данных по назанию recievedmail :
   "use sport_organizations_service" - указываем что работаем с этой базой данных----------*/
con.query("use sport_organizations_service", function(err, result) {
  if (err) throw err;
  console.log("use ok"); // выводим сообщение в консоль, что все хорошо  и к базе данных подключилось
});
/*----Конец блока подключения к БД----------*/

/*------реакция на get запрос. Обращаемся к самому сайту и послыаем пользователю нашу верстку.
Делаем это чтобы на сайте прогрузилась вся наша верстка------*/
app.get("/", function(req, res) {
  res.setHeader("Content-Type", "text/html");
  res.sendFile(__dirname + "/registration_form.html");
})
/*------Конец этого блока------*/

app.get("/main_page", function(req, res) {
  res.setHeader("Content-Type", "text/html");
  res.sendFile(__dirname + "/main_page.html");
})

app.get("/so_reg", function(req, res) {
  res.setHeader("Content-Type", "text/html");
  res.sendFile(__dirname + "/registration_SO.html");
})

// Вывести все спортивные организации
app.get("/sport_org", function(req, res) {
   res.setHeader("Content-Type", "text/html");
   con.query("SELECT sport_organization.id,  `name_SO` , sport_organization.number_SO,  `adress_SO` ,  `quantity_of_members` ,\
     `quantity_of_sections` ,  `quantity_of_groups` ,  `financ_type` , connect_so_st.sport_type FROM sport_organization INNER \
    JOIN connect_so_st ON sport_organization.number_SO = connect_so_st.number_SO", function(err, result, fields) {
      if (err) {
        console.log("sport organization table SELECT - ERROR");
        answer = "ERROR";
        // res.send(answer);
      } else {
        console.log("sport organization table SELECT - OK");
        res.render('sport_org', {
          res:result
        })
        console.log("sport organization table SEND ok");
        // res.send(answer); // отправляем все данные из таблицы
      }
    });
})

// ТАБЛИЦА СПОРТИВНАЯ ОРГАНИЗАЦИЯ
// получение данных с полей и запись их в БД
app.post("/sand_info_about_SO", function(req, res) {
  /*обращаемся к базе данных, посылая запрос на вставку записис в базу.
  Сначала прописываем поля, куда вставить, потом непосредственно значения для вставки */
  con.query("INSERT INTO sport_organization (name_SO,number_SO,adress_SO,quantity_of_members,quantity_of_sections,quantity_of_groups,financ_type) VALUES( \"" + req.body.input_name + "\",\"" + req.body.input_number + "\",\"" +
    req.body.input_adress + "\",\"" + req.body.input_quantity_of_mem + "\",\"" + req.body.input_quantity_of_sec + "\",\"" + req.body.input_quantity_of_sg + "\",\"" + req.body.input_fin_type + "\");",
    function(err, result) {
      if (err) throw err;
      console.log("INSERT in sport_organization - DONE");
    });
    con.query("INSERT INTO connect_so_st (sport_type,number_SO) VALUES (\"" + req.body.sport_type + "\",\"" + req.body.input_number + "\");",
      function(err, result) {
        if (err) throw err;
        console.log("INSERT in connect_so_st -  DONE");
      });

  res.setHeader("Content-Type", "text/html");
  res.sendFile(__dirname + "/registration_SO.html");
})

//Вывести по виду спорта ФИТНЕСС
// app.get("/fitness", function(req, res) {
//    res.setHeader("Content-Type", "text/html");
//    con.query("SELECT sport_organization.id,  `name_SO` , sport_organization.number_SO,  `adress_SO` ,  `quantity_of_members` ,\
//      `quantity_of_sections` ,  `quantity_of_groups` ,  `financ_type` , connect_so_st.sport_type FROM sport_organization INNER \
//     JOIN connect_so_st ON sport_organization.number_SO = connect_so_st.number_SO WHERE connect_so_st.sport_type =  'Фитнес';",
//    function(err, result, fields) {
//       if (err) {
//         console.log("fitness sport type SELECT - ERROR");
//         answer = "ERROR";
//         // res.send(answer);
//       } else {
//         console.log("fitness sport type SELECT - OK");
//         res.render('fitness', {
//           res:result
//         })
//         console.log("fitness sport type SEND ok");
//         // res.send(answer); // отправляем все данные из таблицы
//       }
//     });
// })



app.listen(3000);
console.log("run at 3000");

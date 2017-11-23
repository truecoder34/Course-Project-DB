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

app.get("/coach_reg", function(req, res) {
  res.setHeader("Content-Type", "text/html");
  res.sendFile(__dirname + "/registration_coach.html");
})

// Вывести все спортивные организации
app.get("/sport_org", function(req, res) {
   res.setHeader("Content-Type", "text/html");
   con.query("SELECT sport_organization.id,  `name_SO` , sport_organization.number_SO,  `adress_SO` ,  `quantity_of_members` ,\
     `quantity_of_sections` ,  `quantity_of_groups` ,  `financ_type` , connect_so_st.sport_type FROM sport_organization INNER \
    JOIN connect_so_st ON sport_organization.number_SO = connect_so_st.number_SO", function(err, result, fields) {
      if (err) {
        console.log("ERROR: Notes from 'sport_organization' table  DOESN'T SELECTED - ERROR");
        answer = "ERROR";
        // res.send(answer);
      } else {
        console.log("Success: Notes from 'sport_organization' table SELECTED - DONE");
        res.render('sport_org', {
          res:result
        })
        console.log("Success: Notes from 'sport_organization' table SENT - DONE");
        // res.send(answer); // отправляем все данные из таблицы
      }
    });
})

// Вывести всех тренеров
app.get("/coaches", function(req, res) {
   res.setHeader("Content-Type", "text/html");
   con.query("SELECT  `number_of_SO`, `sport_spec`, `fio_of_coach`, `experience`, `title_of_coach`, `age_of_coach`, `quantity_of_years_in_sport`, sport_organization.name_SO, sport_organization.number_SO\
     FROM `coaches` INNER JOIN sport_organization ON coaches.number_of_SO = sport_organization.number_SO;", function(err, result, fields) {
      if (err) {
        console.log("ERROR: Notes from 'coaches' table  DOESN'T SELECTED - ERROR");
        answer = "ERROR";
        // res.send(answer);
      } else {
        console.log("Success: Notes from 'coaches' table SELECTED - DONE");
        res.render('coaches', {
          res:result
        })
        console.log("Success: Notes from 'coaches' table SENT - DONE");
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
      console.log("Success: New note INSERTED in 'sport_organization' table - DONE");
    });
    con.query("INSERT INTO kind_of_sport (sport_type) VALUES (\"" + req.body.sport_type + "\");",
      function(err, result) {
        if (err) throw err;
        console.log("Success: New note INSERTED in 'kind_of_sport' table - DONE");
      });
    con.query("INSERT INTO connect_so_st (sport_type,number_SO) VALUES (\"" + req.body.sport_type + "\",\"" + req.body.input_number + "\");",
      function(err, result) {
        if (err) throw err;
        console.log("Success: New note INSERTED in 'connect_so_st' table - DONE");
      });

  res.setHeader("Content-Type", "text/html");
  res.sendFile(__dirname + "/registration_SO.html");
})

app.post("/sand_info_about_coach", function(req, res) {
  var fio = req.body.input_first_name +" "+ req.body.input_surname +" "+ req.body.input_second_name;
  /*обращаемся к базе данных, посылая запрос на вставку записис в базу.
  Сначала прописываем поля, куда вставить, потом непосредственно значения для вставки */
  con.query("INSERT INTO coaches (`number_of_SO`, `sport_spec`, `fio_of_coach`, `experience`, `title_of_coach`, `age_of_coach`, `quantity_of_years_in_sport`) VALUES( \"" + req.body.input_number_so + "\",\"" + req.body.input_sport_type + "\",\"" +
    fio + "\",\"" + req.body.input_exp + "\",\"" + req.body.input_rang + "\",\"" + req.body.input_age + "\",\"" + req.body.input_years + "\");",
    function(err, result) {
      if (err) throw err;
      console.log("Success: New note INSERTED in 'coaches' table - DONE");
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

window.onload = initialize;

const ADD = "add";
const UPDATE = "update";
var operation = ADD;
var data;
var selection;
var storageRef;
var fichero;
var fichero2;
var email = "invitado";

function initialize() {
  loadFirebase();
  checkIfLogin();
  downloadTechs();
  loadButtons();
  downloadNews();
  downloadPhotos();
  downloadPets();
  storageRef = firebase.storage().ref();
  fichero = document.getElementById("mdl-add-img");
  fichero2 = document.getElementById("img-photo");

  document.getElementById("all-content").style.display = "none";
  document.getElementById("to-signin").style.display = "unset";
}

function loadButtons() {
  document.getElementById("login-btn").addEventListener("click", openLogInMdl);
  document.getElementById("close-login-mdl").addEventListener("click", closeLogInMdl);
  document.getElementById("cancelLog").addEventListener("click", closeLogInMdl);
  document.getElementById("btn-cls").addEventListener("click", closeModal);
  document.getElementById("add-btn").addEventListener("click", openAddMdl);
  document.getElementById("add-mdl-cls").addEventListener("click", closeAddMdl);
  document.getElementById("form1").addEventListener("submit", AddTechToList);
  document.getElementById("form-login-mdl").addEventListener("submit", logIn);
  document.getElementById("log-out-btn").addEventListener("click", logOut);
  document.getElementById("clicked-petis").addEventListener("click", petiZoneWind);
  document.getElementById("close-subs-mdl").addEventListener("click", closepetiZoneWind);
  document.getElementById("news-btn").addEventListener("click", showTakedaNews);
  document.getElementById("techs-btn").addEventListener("click", showTechsList);
  document.getElementById("add-news-btn").addEventListener("click", openAddNewsMdl);
  document.getElementById("add-news-mdl-cls").addEventListener("click", closeAddNewsMdl);
  document.getElementById("form-add-news-mdl").addEventListener("submit", AddNewsToList);
  document.getElementById("gallery-btn").addEventListener("click", showPhotoGallery);
  document.getElementById("add-photo-btn").addEventListener("click", openPhotoModal);
  document.getElementById("close-photo-modal-btn").addEventListener("click", closePhotoModal);
  document.getElementById("photo-modal").addEventListener("submit", AddPhotoToList);
}

function downloadTechs() {
  selection = document.getElementById("sel1").value;
  var techniques = firebase.database().ref(selection + "/technique");
  techniques.on("value", showTec);
}

function AddTechToList(event) {
  console.log("TEcnica revisando si es edit o enviar");

  event.preventDefault();

  var formTech = event.target;
  selection = document.getElementById("sel1").value;

  if (operation == ADD) {
    console.log("Revisado para enviar");
    document.getElementById("add-tech-btn").style.display = "unset";
    document.getElementById("edit-tech-btn").style.display = "none";

    var name = formTech.name.value;
    var imagenASubir = fichero.files[0];
    var FType = imagenASubir.type;

    if (imagenASubir.type == "image/jpeg") {
      console.log("imagen")
      var uploadTask = storageRef.child(selection + "/image/" + imagenASubir.name).put(imagenASubir);
      uploadTask.on("state_changed",
        function (snapshot) {
          console.log("primer")
        }, function (error) {
          console.log(error);
        }, function () {
          console.log("funciona")
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log('File available at', downloadURL);
            firebase.database().ref(selection + "/technique").push({
              url: downloadURL,
              name,
              FType
            });
          });
        });
    } else {
      console.log("video")
      var uploadTask = storageRef.child(selection + "/video/" + imagenASubir.name).put(imagenASubir);
      uploadTask.on("state_changed",
        function (snapshot) {
          console.log("primer")
        }, function (error) {
          console.log(error);
        }, function () {
          console.log("funciona")
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log('File available at', downloadURL);
            firebase.database().ref(selection + "/technique").push({
              url: downloadURL,
              name,
              FType
            });
          });
        });
    }

    operation = ADD;

    document.getElementById("add-mdl").style.display = "none";
  } else {

    console.log("Revisado para editar")

    var refTech = firebase.database().ref(selection + "/technique/" + keyTechToEdit);
    console.log("La key del producto recien editado es: " + keyTechToEdit);

    refTech.update({
      name: formTech.name.value/*, 
      url: formTech.url.value*/
    });

    document.getElementById("edit-tech-btn").style.display = "unset";
    document.getElementById("add-tech-btn").style.display = "none";

    operation = ADD;
    document.getElementById("add-mdl").style.display = "none";
  }
  resetForm();
}

function showTec(snap) {
  data = snap.val();
  var rows = "";

  if (email != "invitado") {
    if (email == "admin@admin.com") {
      document.getElementById("all-content").style.display = "unset";
      document.getElementById("to-signin").style.display = "none";
      document.getElementById("subs-peti-zone").style.display = "block";
      for (var key in data) {
        console.log("Admin")
        rows +=
          '<tr>' +
          '<td>' + data[key].name + '</td>' +
          '<td><button type="button" data-tech="' + key + '" class="btn-mdl btn btn-primary btn-sm">Show</button></td>' +
          '<td>' +
          '<i class="far fa-trash-alt delete" data-tech="' + key + '"></i>' +
          '<i class="far fa-edit edit" data-tech="' + key + '"></i>' +
          '</td>' +
          '</tr>';
      }
    } else {
      document.getElementById("all-content").style.display = "unset";
      document.getElementById("to-signin").style.display = "none";
      for (var key in data) {
        console.log("NormalTec")
        rows +=
          '<tr>' +
          '<td>' + data[key].name + '</td>' +
          '<td><button type="button" data-tech="' + key + '" class="btn-mdl btn btn-primary btn-sm">Show</button></td>' +
          '<td>' +
          '</td>' +
          '</tr>';
      }
      document.getElementById("add-btn").style.display = "none";
    }
    var myTBody = document.getElementById("my-tbody");
    myTBody.innerHTML = rows;

    var btns = document.getElementsByClassName("btn-mdl");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", openModal);
    }
    var editButtons = document.getElementsByClassName("edit");
    var deleteButtons = document.getElementsByClassName("delete");
    for (var i = 0; i < deleteButtons.length; i++) {
      deleteButtons[i].addEventListener("click", deleteTech);
    }
    for (var i = 0; i < editButtons.length; i++) {
      editButtons[i].addEventListener("click", editTech);
    }
    document.getElementById("news-btn").style.display = "block";
    document.getElementById("techs-btn").style.display = "block";
    document.getElementById("gallery-btn").style.display = "block";
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("log-out-btn").style.display = "block";
  } else {//end If email != invitado
    document.getElementById("all-content").style.display = "none";
    document.getElementById("to-signin").style.display = "unset";
  }
  userLogged();
}

function editTech(event) {
  console.log("Estoy en edit");

  document.getElementById("add-tech-btn").style.display = "none";
  document.getElementById("edit-tech-btn").style.display = "unset";
  operation = UPDATE;

  var buttonClicked = event.target;

  var formTech = document.getElementById("form1");
  keyTechToEdit = buttonClicked.getAttribute("data-tech");
  var refTechToEdit = firebase.database().ref(selection + "/technique/" + keyTechToEdit);
  console.log("La key de la tecnica apunto de editar es: " + keyTechToEdit)

  refTechToEdit.once("value", function (snap) {
    var data = snap.val();
    formTech.name.value = data.name/*,
    formTech.url.value = data.url*/
  });
  openAddMdl();
}

function deleteTech(event) {
  var buttClick = event.target;
  var keyTechToDelete = buttClick.getAttribute("data-tech");
  var refTechToDelete = firebase.database().ref(selection + "/technique/" + keyTechToDelete);
  refTechToDelete.remove();
}

function loadFirebase() {
  console.log("Firebase Loaded");
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCWusAXBApIFx5YnC-hxSbQNl_tv0aOIK0",
    authDomain: "aiki20.firebaseapp.com",
    databaseURL: "https://aiki20.firebaseio.com",
    projectId: "aiki20",
    storageBucket: "aiki20.appspot.com",
    messagingSenderId: "769004079783",
    appId: "1:769004079783:web:93a8c53c46137655686982"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}

function openModal(event) {
  var buttonClicked = event.target;
  var key = buttonClicked.getAttribute("data-tech");
  selection = document.getElementById("sel1").value;

  var MdlName = document.getElementById("mdl-name");
  MdlName.innerHTML = data[key].name;

  if (data[key].FType == "image/jpeg") {
    var MdlImg = document.getElementById("mdl-img");
    MdlImg.src = data[key].url;
    document.getElementById("mdl-vid").style.display = "none";
    document.getElementById("mdl-img").style.display = "unset";
  } else {
    var MdlVid = document.getElementById("mdl-vid");
    MdlVid.src = data[key].url;
    document.getElementById("mdl-img").style.display = "none";
    document.getElementById("mdl-vid").style.display = "unset";
  }
  document.getElementById("mdls-cont").style.display = "unset";
}

function resetForm() {
  console.log("formtBodyario reseteado");
  var formRes = document.getElementById("form1");
  formRes.reset();
  document.getElementById("add-tech-btn").style.display = "unset";
  document.getElementById("edit-tech-btn").style.display = "none";
  operation = ADD;
}

function closeModal() {
  document.getElementById("mdls-cont").style.display = "none";
  var MdlVid = document.getElementById("mdl-vid");
  MdlVid.pause();
}

function closeAddMdl() {
  document.getElementById("add-mdl").style.display = "none";
  resetForm();
}

function openAddMdl() {
  document.getElementById("add-mdl").style.display = "unset";
}

function openLogInMdl() {
  document.getElementById("login-mdl").style.display = "unset";
}

function closeLogInMdl() {
  document.getElementById("login-mdl").style.display = "none";
  var formLogin = document.getElementById("form-login-mdl");
  formLogin.reset();
}

function logIn(event) {
  event.preventDefault();

  var formLogin = event.target;
  email = formLogin.email.value;
  var password = formLogin.pwd.value;

  firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Error")
    alert("Usuario o contraseña erroneos");
    document.getElementById("all-content").style.display = "none";
    document.getElementById("to-signin").style.display = "unset";
    window.location.href = "consultory.html";
    // ...
  });
  document.getElementById('login-mdl').style.display = "none";
  downloadTechs();
}

function checkIfLogin() {
  //event.preventDefault();
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("Ha entrado como: " + email)
    } else {
      console.log("Ha salido")
    }
  });
}

function logOut() {
  firebase.auth().signOut().then(function () {
    // Sign-out successftBody.
    console.log("ha salido correctamente")
    window.location.href = "consultory.html";
  }).catch(function (error) {
    // An error happened.
    console.log("error")
  });
}

function userLogged() {
  document.getElementById("email-logged").innerHTML = email;
}

function searchTech() {
  var input, filter, tBody, tr, a, i;
  input = document.getElementById("mySearch");
  filter = input.value.toUpperCase();
  tBody = document.getElementById("my-tbody");
  tr = tBody.getElementsByTagName("tr");

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    a = tr[i].getElementsByTagName("td")[0];
    if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
}

function petiZoneWind() {
  document.getElementById("subs-modal").style.display = "unset";
  downloadPets();
}

function closepetiZoneWind() {
  document.getElementById("subs-modal").style.display = "none";
}

//thi below is the Js for the news

function showTakedaNews() {
  document.getElementById("news-content").style.display = "block";
  document.getElementById("all-content").style.display = "none";
  document.getElementById("photo-content").style.display = "none";
  document.getElementById("add-photo-btn").style.display = "none";
  downloadNews();
}

function showTechsList() {
  document.getElementById("news-content").style.display = "none";
  document.getElementById("add-news-btn").style.display = "none";
  document.getElementById("all-content").style.display = "unset";
  document.getElementById("photo-content").style.display = "none";
  document.getElementById("add-photo-btn").style.display = "none";
  downloadTechs();
}

function downloadNews() {
  //var Taknews = firebase.database().ref("news").orderByChild("date");
  var Taknews = firebase.database().ref("news");
  Taknews.on("value", showNews);
}

function showNews(snap) {
  console.log("Viendo news")
  let data = snap.val();

  let formattedData = [];

  for(var key in data) {
    let aux = data[key].date;
    console.log(aux)
    let auxElement = {};
    auxElement.key = key;
    auxElement.date = aux.substring(6, 10) + '-' + aux.substring(3, 5) + '-' + aux.substring(0, 2);
    formattedData.push(auxElement);
  }
  
  console.log(formattedData);
  
  formattedData.sort( (a, b) => {
    return - a.date.localeCompare(b.date);
  });

  var rows = "";

  if (email != "invitado") {
    if (email == "admin@admin.com") {
      document.getElementById("all-content").style.display = "none";
      document.getElementById("news-content").style.display = "unset";
      document.getElementById("to-signin").style.display = "none";
      document.getElementById("subs-peti-zone").style.display = "block";
      document.getElementById("add-news-btn").style.display = "unset";
      document.getElementById("subs-peti-zone").style.display = "block";
      for (var i = 0; i < formattedData.length; i++) {
        let key = formattedData[i].key;
        console.log("Admin")
        rows +=
          '<div class="media border p-3 col-sm-11 mt-3">' +
          '<div class="media-body">' +
          '<h4>' + data[key].title + '<small>&nbsp;&nbsp;<i>' + data[key].date + '</i></small></h4>' +
          '<p>' + data[key].body + '</p>' +
          '<div class="row">' +
          // '<i  class="fas fa-ellipsis-h ml-3 plask" data-news="' + key + '"></i>' +
          '<div id="sniegel">' +
          '<i class="far fa-trash-alt delete ml-3" data-news="' + key + '"></i>' +
          '<i class="far fa-edit edit " data-news="' + key + '"></i>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '<img src="img/trnk.png" class="rounded-circle" style="width:60px;" />  ' +
          '</div>'
      }
      // estoy va en el elipsis    data-toggle="collapse" data-target="#demo"
      // y esto en el div solitario  id="demo" class="collapse"
    } else {
      document.getElementById("all-content").style.display = "none";
      document.getElementById("news-content").style.display = "unset";
      document.getElementById("to-signin").style.display = "none";
      document.getElementById("add-news-btn").style.display = "none";
      for (var i = 0; i < formattedData.length; i++) {
        let key = formattedData[i].key;
        console.log("Normaltal")

        rows +=
          '<div class="media border p-3 col-sm-11 mt-3">' +
          '<div class="media-body">' +
          '<h4>' + data[key].title + '<small>&nbsp;&nbsp;<i>' + data[key].date + '</i></small></h4>' +
          '<p>' + data[key].body + '</p>' +
          '</div>' +
          '<img src="img/trnk.png" class="rounded-circle" style="width:60px;" />' +
          '</div>'
      }
      document.getElementById("add-news-btn").style.display = "none";
    }
    // creo que es aqui donde deberia ir el sort dado que abajo es donde le introducen en el html
    // con el data[key].date puedes sacar la fecha en formato dd/mm/aaaa , aunqeu creo que le voy a tener que dar la vuelta en tal caso
    // y las fechas de transforman en la linea 528
    var newsBody = document.getElementById("news-content");
    newsBody.innerHTML = rows;

    var elips = document.getElementsByClassName("plask");
    for (var j = 0; j < elips.length; j++) {
      elips[j].addEventListener("click", showDelEdit);
    }

    var editButtons = document.getElementsByClassName("edit");
    var deleteButtons = document.getElementsByClassName("delete");
    for (var i = 0; i < deleteButtons.length; i++) {
      deleteButtons[i].addEventListener("click", deleteNews);
    }
    for (var i = 0; i < editButtons.length; i++) {
      editButtons[i].addEventListener("click", editNews);
    }
    document.getElementById("news-btn").style.display = "block";
    document.getElementById("techs-btn").style.display = "block";
    document.getElementById("gallery-btn").style.display = "block";
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("log-out-btn").style.display = "block";
  } else {//end If email != invitado
    document.getElementById("all-content").style.display = "none";
    document.getElementById("to-signin").style.display = "unset";
  }
  userLogged();
}

function deleteNews(event) {
  var buttClick = event.target;
  var keyNewsToDelete = buttClick.getAttribute("data-news");
  var refNewsToDelete = firebase.database().ref("news/" + keyNewsToDelete);
  refNewsToDelete.remove();
}

function editNews(event) {
  console.log("Estoy en edit");

  document.getElementById("add-news-mdl-btn").style.display = "none";
  document.getElementById("edit-news-btn").style.display = "unset";
  operation = UPDATE;

  var buttonClicked = event.target;

  var formNews = document.getElementById("form-add-news-mdl");
  keyNewsToEdit = buttonClicked.getAttribute("data-news");
  var refNewsToEdit = firebase.database().ref("news/" + keyNewsToEdit);
  console.log("La key de la tecnica apunto de editar es: " + keyNewsToEdit)

  refNewsToEdit.once("value", function (snap) {
    var data = snap.val();
    formNews.title.value = data.title,
      formNews.Nbody.value = data.body
  });
  openAddNewsMdl();
}

function AddNewsToList(event) {
  console.log("Noticia revisando si es edit o enviar");

  event.preventDefault();

  var formNews = event.target;

  if (operation == ADD) {
    console.log("Revisado para enviar");
    document.getElementById("add-news-btn").style.display = "unset";
    document.getElementById("edit-news-btn").style.display = "none";

    var title = formNews.title.value;
    var body = formNews.Nbody.value;
    date = new Date();
    var meses = new Array("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12");
    date = date.getDate() + "/" + meses[date.getMonth()] + "/" + date.getFullYear();
    firebase.database().ref("news/").push({
      title,
      body,
      date
    });
    operation = ADD;

    document.getElementById("mdl-add-news").style.display = "none";
  } else {

    console.log("Revisado para editar")

    var refTech = firebase.database().ref("news/" + keyNewsToEdit);
    console.log("La key de la noticia recien editada es: " + keyNewsToEdit);

    refTech.update({
      title: formNews.title.value,
      body: formNews.Nbody.value
    });

    document.getElementById("edit-news-btn").style.display = "unset";
    document.getElementById("add-news-btn").style.display = "none";

    operation = ADD;
    document.getElementById("mdl-add-news").style.display = "none";
  }
  resetNewsForm();
}

function closeAddNewsMdl() {
  document.getElementById("mdl-add-news").style.display = "none";
  resetNewsForm();
}

function openAddNewsMdl() {
  console.log("modal abierto")
  if (operation == ADD) {
    document.getElementById("add-news-mdl-btn").style.display = "unset";
    document.getElementById("edit-news-btn").style.display = "none";
  } else {
    document.getElementById("add-news-mdl-btn").style.display = "none";
    document.getElementById("edit-news-btn").style.display = "unset";
  }

  document.getElementById("mdl-add-news").style.display = "unset";
}

function resetNewsForm() {
  console.log("form News reseteado");
  var formRes = document.getElementById("form-add-news-mdl");
  document.getElementById("add-news-btn").style.display = "unset";
  document.getElementById("edit-news-btn").style.display = "none";
  formRes.reset();
  operation = ADD;
}

//this below is JS for the photo gallery

function openPhotoModal() {
  document.getElementById("photo-modal").style.display = "unset";
}

function closePhotoModal() {
  document.getElementById("photo-modal").style.display = "none";
}

function downloadPhotos() {
  var TakPhoto = firebase.database().ref("photo-gallery");
  TakPhoto.on("value", showPhotos);
}

function showPhotos(snap) {
  console.log("Viendo fotos")
  var data = snap.val();
  var rows = "";

  if (email != "invitado") {
    if (email == "admin@admin.com") {
      document.getElementById("all-content").style.display = "none";
      document.getElementById("news-content").style.display = "none";
      document.getElementById("photo-content").style.display = "unset";
      document.getElementById("to-signin").style.display = "none";
      document.getElementById("subs-peti-zone").style.display = "block";
      document.getElementById("add-news-btn").style.display = "none";
      for (var key in data) {
        //ESTOY CON EL SIGUIENTE PROBLEMA Y ES QUE ME SALE UNA ENCIMA DE OTRA 
        console.log("Admin")
        rows +=
          '<div class="col-sm-3">' +
          '<div class="card mt-2">' +
          '<img class="card-img-top" src="' + data[key].url + '" alt="Card image" style="width:100%">' +
          '<p class="card-title-photo">' + data[key].title + '</p>' +
          '<div class="card-body">' +
          '<div class="row">' +
          '<i class="far fa-trash-alt delete" data-photo="' + key + '"></i>' +
          '<i class="far fa-edit edit" data-photo="' + key + '"></i>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>'
      }

    } else {

      //aqui iria un if si el email es igual al email que subio la imagen , que te deje borrar y edita
      document.getElementById("all-content").style.display = "none";
      document.getElementById("news-content").style.display = "none";
      document.getElementById("photo-content").style.display = "unset";
      document.getElementById("to-signin").style.display = "none";

      for (var key in data) {
        console.log("Normal")
        rows +=
          '<div class="col-sm-3">' +
          '<div class="card shadow bg-white mb-2">' +
          '<img class="card-img-top rounded" src="' + data[key].url + '" alt="Card image">' +
          '<p class="card-title-photo">' + data[key].title + '</p>' +
          '<div class="card-body">' +
          '</div>' +
          '</div>' +
          '</div>'
      }
    }

    var photoCont = document.getElementById("photo-content");
    photoCont.innerHTML = rows;

    var editButtons = document.getElementsByClassName("edit");
    var deleteButtons = document.getElementsByClassName("delete");
    for (var i = 0; i < deleteButtons.length; i++) {
      deleteButtons[i].addEventListener("click", deletePhoto);
    }
    for (var i = 0; i < editButtons.length; i++) {
      editButtons[i].addEventListener("click", editPhoto);
    }
    document.getElementById("news-btn").style.display = "block";
    document.getElementById("techs-btn").style.display = "block";
    document.getElementById("gallery-btn").style.display = "block";
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("log-out-btn").style.display = "block";
    document.getElementById("add-photo-btn").style.display = "unset";
  } else {//end If email != invitado
    document.getElementById("all-content").style.display = "none";
    document.getElementById("to-signin").style.display = "unset";
  }
  userLogged();
}


function deletePhoto(event) {
  var buttClick = event.target;
  var keyPhotoToDelete = buttClick.getAttribute("data-photo");
  var refPhotoToDelete = firebase.database().ref("photo-gallery/" + keyPhotoToDelete);
  refPhotoToDelete.remove();
}

function editPhoto(event) {
  console.log("Estoy en edit phot");

  document.getElementById("add-photo-mdl-btn").style.display = "none";
  document.getElementById("edit-photo-mdl-btn").style.display = "unset";
  operation = UPDATE;

  var buttonClicked = event.target;

  var formPhoto = document.getElementById("form-photo");
  keyPhotoToEdit = buttonClicked.getAttribute("data-photo");
  var refPhotoToEdit = firebase.database().ref("photo-gallery/" + keyPhotoToEdit);
  console.log("La key de la foto apunto de editar es: " + keyPhotoToEdit)

  refPhotoToEdit.once("value", function (snap) {
    var data = snap.val();
    formPhoto.Imgtitle.value = data.title
  });
  openPhotoModal();
}

function AddPhotoToList(event) {
  console.log("foto revisando si es edit o enviar");

  event.preventDefault();

  var formPhoto = event.target;

  if (operation == ADD) {
    console.log("Revisado para enviar");
    document.getElementById("add-photo-mdl-btn").style.display = "unset";
    document.getElementById("edit-photo-mdl-btn").style.display = "none";

    var title = formPhoto.Imgtitle.value;
    var imagenASubir = fichero2.files[0];
    var FType = imagenASubir.type;
    var upEmail = email;

    if (imagenASubir.type == "image/jpeg") {
      console.log("imagen")
      var uploadTask = storageRef.child("photo-gallery/image/" + imagenASubir.name).put(imagenASubir);
      uploadTask.on("state_changed",
        function (snapshot) {
          console.log("primer")
        }, function (error) {
          console.log(error);
        }, function () {
          console.log("funciona")
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log('File available at', downloadURL);
            firebase.database().ref("photo-gallery/").push({
              url: downloadURL,
              title,
              FType,
              upEmail
            });
          });
        });
    } else {
      console.log("video")
      var uploadTask = storageRef.child("photo-gallery/video/" + imagenASubir.name).put(imagenASubir);
      uploadTask.on("state_changed",
        function (snapshot) {
          console.log("primer")
        }, function (error) {
          console.log(error);
        }, function () {
          console.log("funciona")
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log('File available at', downloadURL);
            firebase.database().ref("photo-gallery/").push({
              url: downloadURL,
              title,
              FType,
              upEmail
            });
          });
        });
    }

    operation = ADD;

    document.getElementById("add-mdl").style.display = "none";
  } else {

    console.log("Revisado para editar")

    var refPhoto = firebase.database().ref("photo-gallery/" + keyPhotoToEdit);
    console.log("La key de la foto recien editado es: " + keyPhotoToEdit);

    refPhoto.update({
      title: formPhoto.Imgtitle.value
    });

    document.getElementById("edit-photo-mdl-btn").style.display = "unset";
    document.getElementById("add-photo-mdl-btn").style.display = "none";

    operation = ADD;
    document.getElementById("photo-modal").style.display = "none";
  }
  document.getElementById("photo-modal").style.display = "none";
  resetPhotoForm();
}

function resetPhotoForm() {
  console.log("form foto reseteado");
  var formRes = document.getElementById("form-photo");
  document.getElementById("add-photo-mdl-btn").style.display = "unset";
  document.getElementById("edit-photo-mdl-btn").style.display = "none";
  formRes.reset();
  operation = ADD;
}

function showPhotoGallery() {
  document.getElementById("all-content").style.display = "none";
  document.getElementById("news-content").style.display = "none";
  document.getElementById("photo-content").style.display = "unset";
  downloadPhotos();
}



//modal petitions below

function downloadPets() {
  var petis = firebase.database().ref("/subscriptions");
  petis.on("value", showPets);
}

function showPets(snap) {
  var data = snap.val();

  var rows = "";
  for (var key in data) {
    rows += '<tr>' +
      '<td>' + data[key].name + '</td>' +
      '<td>' + data[key].school + '</td>' +
      '<td>' + data[key].country + '</td>' +
      '<td>' + data[key].email + '</td>' +
      '<td>' +
      '<i class="far fa-trash-alt delete" data-peti="' + key + '"></i>' +
      '</td>' +
      '</tr>';
  }

  var myTBody = document.getElementById("t-body-student");
  myTBody.innerHTML = rows;

  var deleteButtonsD = document.getElementsByClassName("delete");
  for (var i = 0; i < deleteButtonsD.length; i++) {
    deleteButtonsD[i].addEventListener("click", deletePeti);
  }
}

function deletePeti(event) {
  var buttonClicked = event.target;
  var keyPetiToDelete = buttonClicked.getAttribute("data-peti");
  var refPetiToDelete = firebase.database().ref("/subscriptions/" + keyPetiToDelete);
  refPetiToDelete.remove();
}
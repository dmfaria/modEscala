function modificaEscala(){
  var lis = document.querySelectorAll("ul.pageitem > li.textbox[onclick*=ppPrat]"); //pega todos elementos li contendo as pontuacoes
  var hrsdescanso = 6; //tempo em horas para ficar indisponível
  var arr = [];
  var today = new Date(); //data e hora do momento
  
  for (var i = 0; i < lis.length; i++) {  
    //pega dh_liberacao 
    dh_liberacao = retornaDataehora(lis[i].children[1].innerHTML); 
   
    //calcula tempo de descanso 
    var diffMs = (today - dh_liberacao); 
    var diffHrs = Math.floor((diffMs/1000) / 3600); // hours
    var diffMins = Math.floor((((diffMs/1000) / 3600)-diffHrs)*60); // minutes  

    //modifica a visualizacao se a pessoa estiver disponível e tiver descansado menos que 6h
    if (lis[i].style.backgroundColor == "rgb(252, 254, 212)") {//não funciona em todos browsers    
      if (diffHrs < hrsdescanso) {
          //encontra a posição dessa pessoa, entre aqueles que descansaram pouco, ordenados por dh_liberacao (fila tradicional)
          var pos = 1;
          for (var j = 0; j < lis.length; j++) {
            hrsdescansotmp = Math.floor(((today - retornaDataehora(lis[j].children[1].innerHTML))/1000)/3600); //horas de descanso da pessoa analisada
            if (i!=j && hrsdescansotmp < hrsdescanso && (lis[j].style.backgroundColor == "rgb(252, 254, 212)" || lis[j].style.backgroundColor == "rgb(211, 211, 211)")) {
              if (dh_liberacao > retornaDataehora(lis[j].children[1].innerHTML) || (dh_liberacao.getTime() == retornaDataehora(lis[j].children[1].innerHTML).getTime() && j<i)){
                pos++;
              }              
            }
          }
          //modifica a vizualização
          lis[i].style.backgroundColor = "#d3d3d3";
          lis[i].children[2].innerHTML = pos + "º (" + diffHrs + "h:" + diffMins +"m) 😴 " + lis[i].children[2].innerHTML;      
      }
    }
  }
  
  //Indica que a escala foi modificada
  lis[0].outerHTML = "<li class='textbox' style='background-color: #000000;color: white;text-align: center; font-size: 14px; font-weight: bold;' >ESCALA COM VALE-DESCANSO</li> " + lis[0].outerHTML;
}


//Transforma o texto yy/hh:mm em datetime - considerando as viradas de mes e de ano
function retornaDataehora (dateString) {      
  var reggie = /(\d{2})\/(\d{2}):(\d{2})/;
  var dateArray = reggie.exec(dateString);
  var today = new Date();
  var mes = today.getMonth();
  var ano = today.getFullYear();
  if (+dateArray[1] > today.getDate()) { //caso tenha virado o mês
    if (mes == 0) { //janeiro (mes começa em zero) - significa que virou o ano tbm
      mes = 11; // dezembro
      ano = ano - 1;
    } else {
      mes = mes - 1;
    }
  }
  return new Date(
      ano,
      mes, 
      (+dateArray[1]),
      (+dateArray[2]),
      (+dateArray[3]),
      0
  );
}

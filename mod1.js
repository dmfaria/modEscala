function modificaEscala(){
  var lis = document.querySelectorAll("ul.pageitem > li.textbox[onclick*=ppPrat]"); //pega todos elementos li contendo as pontuacoes
  var hrsdescanso = 6; //tempo em horas para ficar indisponível
  var arr = [];
  var today = new Date(); //data e hora do momento
  var arredonda = 1;

  for (var i = 0; i < lis.length; i++) {  
    //pega dh_liberacao 
    dh_liberacao = retornaDataehora(lis[i].children[1].innerHTML,arredonda);    
    var validade = new Date(+(dh_liberacao)+hrsdescanso*3600*1000);

    //calcula tempo de descanso 
    var diffMs = (today - dh_liberacao); 
    var diffHrs = Math.floor((diffMs/1000) / 3600); // hours
    var diffMins = Math.floor((((diffMs/1000) / 3600)-diffHrs)*60); // minutes  

    //modifica a visualizacao se a pessoa estiver disponível
    if (lis[i].style.backgroundColor == "rgb(252, 254, 212)") {//não funciona em todos browsers                
      //encontra a posição dessa pessoa, entre aqueles que descansaram pouco, ordenados por dh_liberacao (fila tradicional)          
      var pos = 1; //inicia contagem
      for (var j = 0; j < lis.length; j++) {        
        if (lis[j].style.backgroundColor == "rgb(252, 254, 212)" || lis[j].style.backgroundColor == "rgb(211, 211, 211)") { //analisa somente os disponíveis
          hrsdescansotmp = Math.floor(((today - retornaDataehora(lis[j].children[1].innerHTML))/1000)/3600,arredonda); //horas de descanso da pessoa analisada          
          if (diffHrs < hrsdescanso) {
            //com vale conta apenas pela horário de término sem arredondar           
            if (i!=j) {
              dh_liberacao = retornaDataehora(lis[i].children[1].innerHTML); // pega a hora sem arredondar
              if (dh_liberacao > retornaDataehora(lis[j].children[1].innerHTML) || (dh_liberacao.getTime() == retornaDataehora(lis[j].children[1].innerHTML).getTime() && j<i)){
                pos++;
              }              
            }
          } else {
            //sem vale, conta a posição
            if (i>j && hrsdescansotmp >=hrsdescanso) {
              pos++;
            }
          }
        }
      }
      //modifica a vizualização
      if (diffHrs < hrsdescanso) {
        //com vale
        lis[i].style.backgroundColor = "#d3d3d3";          
        lis[i].children[2].innerHTML = pos + "º (até " + ("0" + validade.getHours()).slice(-2) + ":" + ("0" + validade.getMinutes()).slice(-2) +") 😴 " + lis[i].children[2].innerHTML;                

        if (diffHrs==hrsdescanso-1 && diffMins >=30){ //ultima meia hora
          lis[i].children[2].style.color = "red";
        }
      } else {
        //sem vale
        lis[i].children[2].innerHTML = pos + "º ✔️ " + lis[i].children[2].innerHTML;
      }
    }
  }

  //coloca o aviso dizendo que a escala foi modificada
  if (lis.length>0) {
    lis[0].outerHTML = "<li class='textbox' style='background-color: #000000;color: white;text-align: center; font-size: 14px; font-weight: bold;' >ESCALA COM VALE</li> " + lis[0].outerHTML;
  }
}


//Transforma o texto yy/hh:mm em datetime - considerando as viradas de mes e de ano
//Arredonda para cima de 30 em 30 minutos
//Parametros: dateString hora no formato yy/hh:mm e arredonda 0 ou 1
function retornaDataehora (dateString,arredonda) {      
  var reggie = /(\d{2})\/(\d{2}):(\d{2})/;
  var dateArray = reggie.exec(dateString);
  var today = new Date();
  var mes = today.getMonth();
  var ano = today.getFullYear();
  if (arredonda != 1) {arredonda = 0;}
  if (+dateArray[1] > today.getDate()) { //caso tenha virado o mês
    if (mes == 0) { //janeiro (mes começa em zero) - significa que virou o ano tbm
      mes = 11; // dezembro
      ano = ano - 1;
    } else {
      mes = mes - 1;
    }
  }
  
  //arredonda p cima
  var diff = 0;
  if (dateArray[3] > 30) {   
    diff = 60 - dateArray[3];
  } else if (dateArray[3] > 0) {
     diff = 30 - dateArray[3];
  }
  
  return new Date(
      ano,
      mes, 
      (+dateArray[1]),
      (+dateArray[2]),
      (+dateArray[3]+diff*arredonda),
      0
  ); 
}

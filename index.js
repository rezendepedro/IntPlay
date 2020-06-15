const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

process.env.PWD = process.cwd()

// Then
app.use(express.static(process.env.PWD + '/intPlay/img'));

app.get('/', (req, res) => {
   // fs.readFile('./index.html', (err, html) =>{
   //     res.end(html);
   // })
   let  html = "<!DOCTYPE html> " +
   "<html > " +
   " <head> " +
     "<meta charset='UTF-8'> " +
     "<title>intPlay</title> "  +
     "<link rel='stylesheet' href='./css/bootstrap.min.css'> " +
     "<link rel='stylesheet' href='./css/style.css'> " +
     "<script src='./js/index.js'></script> " +
   "</head> " +
   "<body> " +
   "<div class='contain'> " ;
    const masterPath = path.join(__dirname, './intplay');
    let masterfiles = [];
    masterfiles = fs.readdirSync(masterPath);  
    masterfiles.forEach(function (masterfile, key) {
        if (masterfile == 'img'){
            return;              
        }
        
        html = html + "<div class='slider'> " +
                        "<h3>" + masterfile + "</h3> " +
                        "<span onmouseover='scrollEsquerda(" +key+")' onmouseout='clearScroll()' class='handle handlePrev active'> " +
                          "<i class='fa fa-caret-left' aria-hidden='true'></i> " +
                        "</span> " +
                        "<div id='"+key+"' class='row'> " +
                          "<div class='row__inner'> ";

               let directoryPath = path.join(__dirname, './intplay/' + masterfile);
               let files = [];
               files = fs.readdirSync(directoryPath);
                   
               if (files.length <= 0) {
                   return;
               } 
           
               files.forEach(function (file) {
                   if (file.includes('.srt'))
                       return;              
                   nomeSemExtesao = file;
                   if (nomeSemExtesao.includes('.'))
                     nomeSemExtesao = file.slice(0, -4);
                  
                   html = html + 
                                    "<div class='gui-card'> " +
                                      "<a href='./play/" + nomeSemExtesao + "'>" +
                                        "<div class='gui-card__media'> " +
                                            "<img class='gui-card__img' src='./" +  nomeSemExtesao + ".jpg ' alt=''  /> " +
                                        "</div>" +
                                        "<div class='gui-card__details'> " +
                                            "<div class='gui-card__title'> " +
                                                nomeSemExtesao +
                                            "</div> " +
                                        "</div> " +
                                      "</a> " +
                                   "</div> "  ;
               });
           
           
               html = html + " </div> " +
                        "   </div> " +
                       "    <span onmouseover='scrollDireita("+key+")' onmouseout='clearScroll()'  class='handle handleNext active'> " +
                       "      <i class='fa fa-caret-right' aria-hidden='true'></i> " +
                       "    </span> " +
                       "  </div>" ;       
        
    });

    html = html +     " </div>" +
                    "</body>"+
                 "</html>";

    

    res.end(html);
});

app.get('/legends/:legendName', (req, res) => {
    const { legendName } = req.params 
    const legendFile = `./intplay/Filmes/${legendName}`; 
    fs.readFile(legendFile, (err, legenda) =>{
        res.end(legenda);
    })
});

app.get('/play/:filename', (req , res) =>{
   
    const { filename } = req.params;
    let  html = "<!DOCTYPE html>  " +
    "   <html>        "  +
    "     <head>      " +
    "      <meta charset='utf-8'> " +
    "      <title>IntPlay</title> " +
    "      <meta name='viewport' content='width=device-width,initial-scale=1'> " +
    "      </head> " +
    "      <body style='text-align:center'> " +
    "        <div style='margin:0 auto;'> " +
    "           <video id='video' src='/Filmes/" + filename  + ".mkv' controls='' autoplay width='640' height='480'> " +
    "             <track src='/legends/ " + filename + ".srt' kind='subtitles' srclang='pt' label='Português'> " +
    "           </video> " +
    "         </div> " +
    "       </body> " +
    "    </html>";
    res.end(html);
})

app.get('/Filmes/:movieName', (req, res) => {
    const { movieName } = req.params 
    const movieFile = `./intplay/Filmes/${movieName}`;

    fs.stat(movieFile, (err, stats) => {
        if(err){
            console.log(err);
            return res.status(404).end('<h1>Filme não encontrado');
        }
        const { range } = req.headers;
        const { size } = stats;
        const start = Number((range || '').replace(/bytes=/, '').split('-')[0]);
        const end = size - 1;
        const chunkSize = (end - start) + 1;
        res.set({
            'Content-Range': `bytes ${start}-${end}/${size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mkv'
        });
        
        res.status(206);
        const stream = fs.createReadStream(movieFile, { start, end });
        stream.on('open', () => stream.pipe(res));
        stream.on('error', (streamErr) => res.end(streamErr));
    }); 
});

app.get('/favicon.ico', (req, res) => res.status(204));

app.listen(3000, () => console.log('IntPlay Online!'));
var mysql      = require('mysql');
var minDelay = 1500;
var maxDelay = 2000;


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'dummycallcenter'
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

var botTask = function() {
    console.log(new Date(), 'bot doing somethin...');

    let insertSQL = 'insert into dummycallcenter.current_call_entry(id_agent,callerid, datetime_init) select ROUND((RAND() * (52-1))+1), ROUND((RAND() * (19999999999-15000000000))+15000000000), now()';
    let countSQL = 'select max(id) "max", min(id) "min", max(id) - min(id) "diff" from dummycallcenter.current_call_entry';
    let deleteSQL = 'delete from dummycallcenter.current_call_entry where id < ?';
    connection.query(insertSQL, function (error, results, fields) {
      if (error) throw error;
      console.log('result from insertSQL: ', results);
    });
    connection.query(countSQL, function (error, results, fields) {
        if (error) throw error;
        console.log('result from countSQL: ', results);
/*        
        if(results[0].diff>9) {
            let mid = Math.floor((results[0].max+results[0].min)/2);
            connection.query(deleteSQL, [mid], function (error, results, fields) {
                if (error) throw error;
                console.log('result from deleteSQL: ', results);
            }); // connection.query deleteSQL
        }; // end if results[0].diff>9
*/        
    }); // connection.query countSQL
}; //botTask end

var getDelay = function() {
    return minDelay + Math.random() * (maxDelay - minDelay);
};

var runBot = function() {
    setTimeout(function() {
        botTask();
        runBot();
        console.log(new Date(),'bot in action','==============================================')
    }, getDelay());
};

runBot();




// var query = connection.query('SELECT now()');
// query
//     .on('error', function(err) {
//         // Handle error, an 'end' event will be emitted after this as well
//     })
//     .on('fields', function(fields) {
//     // the field packets for the rows to follow
//     })
//     .on('result', function(row) {
//         // Pausing the connnection is useful if your processing involves I/O
//         connection.pause();
//         processRow(row, function() {
//             connection.resume();
//         });
//     })
//     .on('end', function() {
//         // all rows have been received
//     });

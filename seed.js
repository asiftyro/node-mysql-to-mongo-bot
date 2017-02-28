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
    let insertSQL = 'insert into dummycallcenter.tab_cdr(insert_timestamp) select now()';
    let countSQL = 'select max(autoid) "max", min(autoid) "min", max(autoid) - min(autoid) "diff" from dummycallcenter.tab_cdr';
    let deleteSQL = 'delete from dummycallcenter.tab_cdr where autoid < ?';
    connection.query(insertSQL, function (error, results, fields) {
      if (error) throw error;
      console.log('result from insertSQL: ', results);
    });
    connection.query(countSQL, function (error, results, fields) {
        if (error) throw error;
        console.log('result from countSQL: ', results);
        if(results[0].diff>9) {
            let mid = Math.floor((results[0].max+results[0].min)/2);
            connection.query(deleteSQL, [mid], function (error, results, fields) {
                if (error) throw error;
                console.log('result from deleteSQL: ', results);
            }); // connection.query deleteSQL
        }; // end if results[0].diff>9
    }); // connection.query countSQL
}; //botTask end

var getDelay = function() {
    return minDelay + Math.random() * (maxDelay - minDelay);
};

var runBot = function() {
    setTimeout(function() {
        botTask();
        runBot();
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

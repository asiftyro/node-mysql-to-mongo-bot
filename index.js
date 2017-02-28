var mysql       = require('mysql');
var _ = require('underscore');

console.log(_.VERSION);

var minDelay    = 500;
var maxDelay    = 1000;

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'dummycallcenter'
}); // end connection

let selectSQL = 'select distinct * from dummycallcenter.tab_cdr where autoid> ?';

var bot = {
    lastInsertedId: 0,
    act: function() {
        console.log(new Date, 'bot acts...');
        console.log('lastInsertedId: ', this.lastInsertedId);
        connection.query(
            selectSQL,
            [this.lastInsertedId],
            function (error, results, fields) {
                if(error) throw error;
                let min = _.min(results, function(r){ return r.autoid});
                // compare min with lastInsertedId. then either insert and then set lastInsertID
                console.log(min.autoid)
            } // end method: callback
        ); //end connection.query: selectSQL


        let delay = minDelay + Math.random() * (maxDelay - minDelay);
        setTimeout(this.act.bind(this), delay);
    }, //end method: act
}; //end bot

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    };//end if err
    console.log('connected as id ' + connection.threadId);
}); //end connect

bot.act();

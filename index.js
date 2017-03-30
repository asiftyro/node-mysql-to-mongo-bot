let mysql       = require('mysql');
let mongoClient = require('mongodb').MongoClient;
let _           = require('underscore');
let LAST_ID = -1;

let minDelay    = 500; //milli seconds
let maxDelay    = 1000; //milli seconds


process.env.TZ = 'Asia/Dhaka';

var connection = mysql.createConnection({
    host     : '',
    user     : 'asif',
    password : '',
    database : 'call_center'
}); // end connection

var mongoConnStr = 'mongodb://localhost:27017/weCare';

let selectSQL = 
  "select "
+ "id_agent, callerid, datetime_init, max(id) \"id\" from call_center.current_call_entry where "
+ "id_agent in('10', '11', '12', '13', '14', '15', '16', '17', '24', '28', '30', '52') "
+ "and id > ? "
+ "group by id_agent, callerid, datetime_init";


    

var bot = {
    act: function() {
        connection.query(
            selectSQL,
            [LAST_ID],
            function (error, results, fields) {
                if(error) throw error;
                if(_.size(results)) {
                    let max = _.max(results, function(r){ return r.id});
                    mongoClient.connect(mongoConnStr, function(err, db) {
                        if(!err) {
                            console.log("connected to mongo");
                            var collection = db.collection('supCDR');

                            _.each(results, function(d){
                                collection.insert(d);
                                console.log('=======================================================================');
                                console.log('inserted ', d);
                            }); //loop each

                            LAST_ID = max.id;

                            db.close();
                        }; //end if err
                    }); //mongoClient.connect
                }; //end if results
            } // end method: callback
        ); //end connection.query: selectSQL
        console.log(new Date(), 'bot acting')
        let delay = minDelay + Math.random() * (maxDelay - minDelay);
        setTimeout(this.act.bind(this), delay);
    }, //end method: act
}; //end bot

// connect to mysql db
connection.connect(function(err) {
    if (err) {
        console.error('error connecting mysql: ' + err.stack);
        return;
    };//end if err
    console.log('connected to mysql as id ' + connection.threadId);
}); //end connect mysql


mongoClient.connect(mongoConnStr, function(err, db) {
    if(!err) {
        console.log("connected to mongo");
        var collection = db.collection('supCDR');
        let cursor = collection.find().sort({_id:-1}).limit(1);

        cursor.next(function(err, doc){
                if (doc != null) {
                    LAST_ID = doc.id;
                    bot.act();
                }  else
                {
                    LAST_ID = 0;
                    bot.act();
                }
        });
        
        db.close();
    }; //end if err
}); //mongoClient.connect



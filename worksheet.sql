------------------------------------------------------------------
--  DATABASE dummycallcenter
------------------------------------------------------------------

use dummycallcenter;

drop table dummycallcenter.tab_cdr;

create table dummycallcenter.tab_cdr(
	autoid bigint UNSIGNED  AUTO_INCREMENT,
	insert_timestamp datetime,
	primary key(autoid)
);

insert into dummycallcenter.tab_cdr(insert_timestamp) select now();

select distinct * from dummycallcenter.tab_cdr where autoid> 644;

select max(autoid) "max", min(autoid) "min", max(autoid) - min(autoid) "diff" from dummycallcenter.tab_cdr;

truncate table dummycallcenter.`current_call_entry`;

delete from dummycallcenter.tab_cdr where autoid < 1;


CREATE TABLE `current_call_entry` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `id_agent` int(10) unsigned,
  `id_queue_call_entry` int(10) unsigned,
  `id_call_entry` int(10) unsigned,
  `callerid` varchar(15),
  `datetime_init` datetime,
  `uniqueid` varchar(32),
  `ChannelClient` varchar(32),
  `hold` varchar(32),
  primary key(id)
  );

select distinct id, id_agent, callerid, datetime_init from current_call_entry order by 1 desc;

insert into dummycallcenter.current_call_entry(id_agent,callerid, datetime_init) select ROUND((RAND() * (25-20))+20), ROUND((RAND() * (19999999999-15000000000))+15000000000), now()


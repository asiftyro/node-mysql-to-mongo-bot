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

truncate table dummycallcenter.tab_cdr;

delete from dummycallcenter.tab_cdr where autoid < 1;




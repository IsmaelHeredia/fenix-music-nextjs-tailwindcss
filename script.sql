create table users(
	id int not null auto_increment,
	user varchar(100) unique,
	pwd varchar(100),
	primary key(id)
);

create table playlists(
	id int not null auto_increment,
	name varchar(100) unique,
	primary key(id)
);

create table songs(
	id int not null auto_increment,
	title varchar(100),
	duration_string varchar(100),
	fullpath text,
	id_playlist int,
	primary key(id),
	foreign key (id_playlist) references playlists(id) 
);

create table stations(
	id int not null auto_increment,
	name text unique,
	link text,
	categories varchar(100),
	primary key(id)
);

create table live_streams(
	id int not null auto_increment,
	name text unique,
	link text,
	categories varchar(100),
	primary key(id)
);

create table videos(
	id int not null auto_increment,
	name varchar(100),
	fullpath text,
	primary key(id)
);

create table config(
	id int not null auto_increment,
	song_directory text,
	video_directory text,
	primary key(id)
);

insert into users(user,pwd) 
	values('supervisor','$2a$11$n3wJp8J589XUawMW2tdk4eghkRqMys.NA7YfaoMq6.jLzOHF8QjBa');

insert into stations(name,link,categories) values('Alternative Rock','http://7579.live.streamtheworld.com:80/977_ALTERN_SC','Rock');
insert into stations(name,link,categories) values('Bulldogs-Radio','http://198.58.98.83:8062/stream','Rock, Heavy Metal');
insert into stations(name,link,categories) values('Classic Rock 2','http://7599.live.streamtheworld.com:80/977_CLASSROCK_SC','Rock');
insert into stations(name,link,categories) values('Magic 80s Florida','http://airspectrum.cdnstream1.com:8018/1606_192','Rock, Oldies');
insert into stations(name,link,categories) values('Radio Bloodstream','http://uk1.internet-radio.com:8294/stream','Rock, Metal');
insert into stations(name,link,categories) values('Hard Rock Radio Live','http://listen.radionomy.com/hardrockradioliveclassicrock','Rock, Classic Rock');
insert into stations(name,link,categories) values('#MUSIK.TECHHOUSE (PROGRESSIVE) - WWW.RAUTEMUSIK.FM - 24H MIXED PROGRESSIVE ELECTRO MINIMAL AND MORE!','http://techhouse-high.rautemusik.fm','Techno');
insert into stations(name,link,categories) values('Eye Of Destiny Radio','http://uk6.internet-radio.com:8428/stream','Chillout');
insert into stations(name,link,categories) values('LOUNGE-RADIO.COM swiss made','http://77.235.42.90:80/stream','Chillout');
insert into stations(name,link,categories) values('MoveDaHouse','http://212.71.250.12:8000/stream','House');
insert into stations(name,link,categories) values('PARTY VIBE RADIO : AMBIENT + CHILLOUT + RELAXATION','http://www.partyviberadio.com:8056/stream','Meditation');
insert into stations(name,link,categories) values('PARTY VIBE RADIO : DUBSTEP + TRAP + BASS','http://www.partyviberadio.com:8040/stream','Dubstep');
insert into stations(name,link,categories) values('PARTY VIBE RADIO : TECHNO + HOUSE + TRANCE + ELECTRONIC','http://www.partyviberadio.com:8046/stream','Techno');
insert into stations(name,link,categories) values('PulseEDM Dance Music Radio','http://pulseedm.cdnstream1.com:8124/1373_128','Dubstep');
insert into stations(name,link,categories) values('Radio Play Emotions','http://5.39.82.157:8054/stream','Dubstep');
insert into stations(name,link,categories) values('The Zone- Dublin','http://uk1.internet-radio.com:8355/stream','Alternative');
insert into stations(name,link,categories) values('Venice Classic Radio Italia','http://116.202.241.212:8010','Classical');
insert into stations(name,link,categories) values('JAZZGROOVE.org','http://199.180.72.2:8015/stream','Jazz');
insert into stations(name,link,categories) values('HOT 108 JAMZ - #1 FOR HIP HOP - www.hot108.com (a Powerhitz.com station)','http://hot108jamz.hot108.com:4040','Hip Hop');
insert into stations(name,link,categories) values('PARTY VIBE RADIO : RAP + HIP HOP + TRAP + DUBSTEP','http://www.partyviberadio.com:8016/stream','Rap, Hip Hop, Trap, Dubstep');
insert into stations(name,link,categories) values('Power 95 Bermuda','http://us3.internet-radio.com:8026/stream','Hip Hop');
insert into stations(name,link,categories) values('Merge 104.8','http://212.71.250.12:8040/stream','Top40');
insert into stations(name,link,categories) values('PopTron: Electro-Pop and Indie Dance Rock [SomaFM]','http://ice3.somafm.com/poptron-128-mp3','Pop');

insert into live_streams(name,link,categories) values('METAL 24/7 Live Stream - NUCLEAR BLAST RECORDS','https://www.youtube.com/watch?v=lCjVa1c5zKw','Music');
insert into live_streams(name,link,categories) values('lofi hip hop radio - beats to sleep/chill to','https://www.youtube.com/watch?v=rUxyKA_-grg','Music');

insert into config(song_directory,video_directory) values('C:/Users/Admin/Music','C:/Users/Admin/Videos');
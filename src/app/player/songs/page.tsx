"use client";

import LayoutPlayer from "@/components/LayoutPlayer";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faCirclePause, faCirclePlay, faCircleStop, faForward, faArrowsRotate, faRotateRight, faVolumeHigh, faGear } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import {Howl, Howler} from "howler";

import Marquee from "react-fast-marquee";

import { useRouter } from "next/navigation";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useAuth from "@/components/useAuth";

const PlayerSongs = () => {

  const [activeTab, setActiveTab] = useState(1);

  const [playlistsDB, setPlaylistsDB] = useState([]);

  const [songsDB, setSongsDB] = useState([]);

  const [playlistsList, setPlaylistsList] = useState([]);

  const [songsList, setSongsList] = useState([]);

  const [musicPlayer, setMusicPlayer] = useState<any>();

  const [playlistID, setPlaylistID] = useState<any>();

  const [songID, setSongID] = useState<any>();

  const [songData, setSongData] = useState<any>();

  const [repeatMode, setRepeatMode] = useState(true);

  const [playingMusic, setPlayingMusic] = useState(false);

  const [inputFilterPlaylist, setInputFilterPlaylist] = useState("");

  const [inputFilterSong, setInputFilterSong] = useState("");

  const handleClickTab = (index: any) => {
    setActiveTab(index);
  }
  
  useEffect(() => {

    async function loadSongs() {

      const id_toast = toast.loading("Loading songs ...");

      axios
          .get(process.env.NEXT_PUBLIC_API_URL + "/songs")
          .then(response => {
              var data = response.data;
              var status = data.status;
              if (status == 1) {

                toast.dismiss(id_toast);

                const songs = data.songs;
                const playlists = data.playlists;
                playlists.unshift({"id":0,"name":"All"});
                setPlaylistsDB(playlists);
                setSongsDB(songs);
                setPlaylistsList(playlists);
                setSongsList(songs);
                setPlaylistID(0);

              } else {

                toast.update(id_toast, {render: "Error loading songs", type: "warning", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST)});

              }
          })
          .catch(function (error) {
              const message = error.response.data.message ? error.response.data.message : "Something went wrong";
              toast.update(id_toast, {render: message, type: "error", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
              console.log(error);
          })
    }

    loadSongs();

  }, []);


  const handleClickPlaylist = async(id: any) => {
    if(id == 0) {
      setPlaylistID(0);
      setSongsList(songsDB);
    } else {
      const songs_filter: any = [];
      songsDB.forEach( function(song: any,index) {
        if(song.id_playlist == id) {
          songs_filter.push(song);
        }
      });
      setPlaylistID(id);
      setSongsList(songs_filter);
    }
  };

  async function findIndexSongPlayer() {
    let id = songID;
    let list = songsList;
    let index = 0;
    for (var i = 0; i < list.length; i++) {
      var item: any = list[i];
      if(id == item.id) {
        index = i;
        break;
      }
    }
    return index;  
  }

  async function playSong(id: any) {

    const id_toast = toast.loading("Loading song ...");

    axios
        .get(process.env.NEXT_PUBLIC_API_URL + "/songs/" + id)
        .then(response => {
            var data = response.data;
            var status = data.status;
            if (status == 1) {

              toast.dismiss(id_toast);

              let list: any = songsList;
              
              let data_song = list.find((s: { id: any; }) => s.id === id);

              setSongID(id);
              setSongData(data_song);

              if(musicPlayer) {
                musicPlayer.stop();
                setMusicPlayer(null);
              }

              const newMusic = new Howl({
                html5: true,
                src:[data.temp_song],
                autoplay:true,
                loop:true
              })

              setMusicPlayer(newMusic);

              setPlayingMusic(true);

            } else {

              toast.update(id_toast, {render: "Error loading song", type: "warning", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST)});

            }
        })
        .catch(function (error) {
            const message = error.response.data.message ? error.response.data.message : "Something went wrong";
            toast.update(id_toast, {render: message, type: "error", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
            console.log(error);
        })
  }

  const handleClickSong = async(id: any) => {
    playSong(id);
  };

  const handleClickPlay = () => {
    if(musicPlayer) {
      musicPlayer.play();
      setPlayingMusic(true);
    }
  }

  const handleClickPause = () => {
    if(musicPlayer) {
      musicPlayer.pause();
      setPlayingMusic(false);
    }
  }

  const handleClickStop = () => {
    if(musicPlayer) {
      musicPlayer.stop();
    }
    setMusicPlayer(null);
    setSongID(null);
    setSongData(null);
    setPlayingMusic(false);
  }

  const handleClickPrevious = async() => {
    if(musicPlayer) {
      let list = songsList;
      let index = await findIndexSongPlayer();
      let previous_index = index - 1;
      if(typeof list[previous_index] !== "undefined") {
        let data_song: any = list[previous_index];
        playSong(data_song.id);
      } else {
        let data_song: any = list[list.length - 1];
        playSong(data_song.id);      
      }
    }
  }

  const handleClickNext = async() => {
    if(musicPlayer) {
      let list = songsList;
      let index = await findIndexSongPlayer();
      let next_index = index + 1;
      if(typeof list[next_index] !== "undefined") {
        let data_song: any = list[next_index];
        playSong(data_song.id);
      } else {
        let data_song: any = list[0];
        playSong(data_song.id);
      }
    }
  }

  const handleClickRepeat = () => {
    handleClickStop();
    if(repeatMode == true) {
      setRepeatMode(false);
    } else {
      setRepeatMode(true);
    }
  }

  function handleUpdateVolume(e: any) {
    Howler.volume(parseInt(e.target.value, 10) / 100);
  }

  useEffect(() => {
    setSongPosition(0);
    if (musicPlayer) {
      musicPlayer.seek(0);
    }
  }, [musicPlayer]);

  function handleUpdatePosition(e: any) {
    let timePosition = 0;
    timePosition = parseInt(e.target.value, 10);
    setSongPosition(timePosition);
    musicPlayer.seek(timePosition);
  }

  const [songPosition ,setSongPosition] = useState<any>()

  function formatDuration(totalSeconds:number) {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    const result_time = String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2 , '0');
    return result_time;
  }

  const currentPosition = formatDuration(songPosition);

   useEffect(() => {
    let timerInterval: any;
    if(musicPlayer){ 
      const  updaterTimer = () => {
        const seekTimer = Math.round(musicPlayer.seek())
        setSongPosition(seekTimer)
      };
      timerInterval = setInterval(updaterTimer , 1000)
      console.log(songPosition);
    }
    return () => {
      clearInterval(timerInterval)
    }
  }, [musicPlayer])

  useEffect(() => {
    if (musicPlayer) {
      let songPositionCheck = songPosition + 1;
      if(songPositionCheck == Math.round(musicPlayer.duration())) {
        if(songPosition != 0) {
          if(repeatMode == false) {
            musicPlayer.stop();
            handleClickNext();
          }
        }
      }
    }
  }, [songPosition]);

  const onChangeHandlerFilterPlaylist = (event: { target: { value: React.SetStateAction<string>; }; }) => {
     setInputFilterPlaylist(event.target.value);
  };

  const onChangeHandlerFilterSong = (event: { target: { value: React.SetStateAction<string>; }; }) => {
     setInputFilterSong(event.target.value);
  };

  const handleFilterPlaylists = () => {
    handleClickStop();
    const playlists_filter: any = [];
    playlistsDB.forEach( function(playlist: any,index) {
      var name = playlist.name;
      if (name.toLowerCase().indexOf(inputFilterPlaylist.toLowerCase()) > -1) {
        playlists_filter.push(playlist);
      }
    });
    setPlaylistsList(playlists_filter);
    setSongsList([]);
  }

  const handleFilterSongs = () => {
    handleClickStop();
    const songs_filter: any = [];
    if(playlistID == 0) {
      songsDB.forEach( function(song: any,index) {
        var title = song.title;
        if (title.toLowerCase().indexOf(inputFilterSong.toLowerCase()) > -1) {
          songs_filter.push(song);
        }
      });
    } else {
      songsDB.forEach( function(song: any,index) {
        if(song.id_playlist == playlistID) {
          var title = song.title;
          if (title.toLowerCase().indexOf(inputFilterSong.toLowerCase()) > -1) {
            songs_filter.push(song);
          }
        }
      });      
    }
    setSongsList(songs_filter);
  }

  const router = useRouter();

  return (

  <LayoutPlayer>

    <div id="player-songs" className="flex flex-col flex-1">

        <div className="bg-vc-border-gradient rounded-lg p-px">
            <div className="py-6 rounded-lg">
              <div
                className="bg-vc-border-gradient inset-x-0 bottom-3 mx-3 rounded-lg p-px shadow-lg shadow-black/20 border-gray-800 border"
              >
                  <div className="grid grid-cols-2">

                    <div id="div_playlists" className="flex flex-col justify-between space-y-2 rounded-lg bg-black p-3.5 lg:px-5 lg:py-3 mr-3">

                      <div className="flex flex flex-row items-center w-full">
                        <div className="mr-2">
                          <button className="btn-table-primary">{playlistsList.length} playlists</button>
                        </div>
                        <div>
                          <input id="search-playlist" type="search" className="text-black block w-full py-2 pl-10 border border-gray-300 rounded-lg sm:text-sm" placeholder="Search here"
                            onChange={onChangeHandlerFilterPlaylist}
                            value={inputFilterPlaylist}
                            onKeyPress={event => {
                              if (event.key === "Enter") {
                                handleFilterPlaylists();
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="scrollbar">
                          <table className="table table-hover" id="table_playlists">
                              <thead>
                                  <tr>
                                      <th scope="col">Title</th>
                                  </tr>
                              </thead>
                              <tbody>
                                {playlistsList.map(function(playlist: any,index){
                                   return (
                                    <tr key={"playlists_" + playlist.id} onDoubleClick={() => handleClickPlaylist(playlist.id)} className={(playlistID === playlist.id ? "itemSelected" : "")}>
                                      <td>{playlist.name}</td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                          </table>
                      </div>
                    </div>

                    <div id="div_songs" className="flex flex-col justify-between space-y-2 rounded-lg bg-black p-3.5 lg:px-5 lg:py-3">

                      <div className="flex flex flex-row items-center w-full">
                        <div className="mr-2">
                          <button className="btn-table-primary">{songsList.length} songs</button>
                        </div>
                        <div>
                          <input id="search-playlist" type="search" className="text-black block w-full py-2 pl-10 border border-gray-300 rounded-lg sm:text-sm" placeholder="Search here"
                            onChange={onChangeHandlerFilterSong}
                            value={inputFilterSong}
                            onKeyPress={event => {
                              if (event.key === "Enter") {
                                handleFilterSongs();
                              }
                            }}
                          />
                        </div>
                        <div className="right-group">
                          {
                            playingMusic == false &&
                              <button onClick={() =>  router.replace("/player/settings/songs")} className="btn-icon mr-2"><FontAwesomeIcon icon={faGear} /></button>
                          }
                        </div>
                      </div>

                      <div className="scrollbar">
                          <table className="table table-hover" id="table_songs">
                              <thead>
                                  <tr>
                                      <th scope="col">Title</th>
                                      <th scope="col">Duration</th>
                                  </tr>
                              </thead>
                              <tbody>
                                {songsList.map(function(song: any,index){
                                   return (
                                    <tr key={"songs_" + song.id} onDoubleClick={() => handleClickSong(song.id)} className={(songID === song.id ? "itemSelected" : "")}>
                                      <td>{song.title}</td>
                                      <td>{song.duration_string}</td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                          </table>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
        </div>

        <div id="player-controls">

          <div className="flex flex-row pt-6 pb-3 pl-3 items-center justify-center">

            <div id="player-info" className="flex flex-row">
              <div id="title">
                <Marquee style={{ width:  "300px" }}>{songData ? songData.title : "Please select song"}</Marquee>
              </div>
            </div>

            <div id="player-input" className="limit-player">
              <div className="flex flex flex-row items-center w-full">
                <div id="status" className="pr-2">{currentPosition ? currentPosition : "00:00"}</div>
                <div className="pr-2 line-player w-100 shrink-0">
                  <input id="status-bar" className="rounded-sm cursor-pointer" type="range" min="0" max={musicPlayer ? musicPlayer.duration() : 0} value={songPosition || 0} onChange={handleUpdatePosition} />
                </div>
                <div id="duration" className="pr-2">{songData ? songData.duration_string : "00:00"}</div>
              </div>
            </div>

            <div id="player-volume" className="limit-player">
              <div className="flex flex-row">
                <div className="pr-2">
                  <FontAwesomeIcon icon={faVolumeHigh} className="player-icons" />
                </div>
                <div className="volume-bar">
                  <input onChange={handleUpdateVolume} id="volume-bar" type="range" max="100" defaultValue="100" />
                </div>
              </div>
            </div>

          </div>

          <div id="player-buttons" className="flex justify-center items-center mb-2">
            <button onClick={() => handleClickPrevious()} className="btn-player pr-2"><FontAwesomeIcon icon={faBackward} className="player-icons" /></button>
            
            {
              playingMusic == true &&
                <button onClick={() => handleClickPause()} className="btn-player pr-2"><FontAwesomeIcon icon={faCirclePause} className="player-icons" /></button>
            }

            {
              playingMusic == false &&
                <button onClick={() => handleClickPlay()} className="btn-player pr-2"><FontAwesomeIcon icon={faCirclePlay} className="player-icons" /></button>
            }

            {
              playingMusic == true &&
                <button onClick={() => handleClickStop()} className="btn-player pr-2"><FontAwesomeIcon icon={faCircleStop} className="player-icons" /></button>
            }

            <button onClick={() => handleClickNext()} className="btn-player pr-2"><FontAwesomeIcon icon={faForward} className="player-icons" /></button>

            {
              repeatMode == false &&
                <button onClick={() => handleClickRepeat()} className="btn-player pr-2"><FontAwesomeIcon icon={faArrowsRotate} className="player-icons" /></button>
            }

            {
              repeatMode == true &&
                <button onClick={() => handleClickRepeat()} className="btn-player pr-2"><FontAwesomeIcon icon={faRotateRight} className="player-icons" /></button>
            }
          </div>

        </div>

    </div>

  </LayoutPlayer>

  );

};

export default useAuth(PlayerSongs);
"use client";

import LayoutPlayer from "@/components/LayoutPlayer";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faDisplay } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import {Howl, Howler} from 'howler';

import { useRouter } from "next/navigation";

import dynamic from "next/dynamic";

const Plyr = dynamic(() => import("plyr-react"), { ssr: false });

import "plyr-react/plyr.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useAuth from "@/components/useAuth";

const ListVideo = () => {

  const [videosDB, setVideosDB] = useState([]);

  const [videosList, setVideosList] = useState([]);

  const [videoID, setVideoID] = useState<any>();

  const [videoData, setVideoData] = useState<any>();

  const [inputFilterVideo, setInputFilterVideo] = useState("");

  const [playingStream, setPlayingStream] = useState(false);

  const [videoURL, setVideoURL] = useState("");

  const videoRef = useRef<any>(null);
  
  useEffect(() => {

    async function loadVideos() {

      const id_toast = toast.loading("Loading videos ...");

      axios
          .get(process.env.NEXT_PUBLIC_API_URL + "/videos")
          .then(response => {
              var data = response.data;
              var status = data.status;
              if (status == 1) {

                toast.dismiss(id_toast);

                const videos = data.videos;
                setVideosDB(videos);
                setVideosList(videos);

              } else {

                toast.update(id_toast, {render: "Error loading videos", type: "warning", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST)});

              }
          })
          .catch(function (error) {
              const message = error.response.data.message ? error.response.data.message : "Something went wrong";
              toast.update(id_toast, {render: message, type: "error", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
              console.log(error);
          })
    }

    loadVideos();

  }, []);

  useEffect(() => {    
    videoRef.current?.load();
  }, [videoURL]);

  const handleClickVideo = async(id:any) => {

    const id_toast = toast.loading("Loading video ...");

    axios
        .get(process.env.NEXT_PUBLIC_API_URL + "/videos/" + id)
        .then(response => {
            var data = response.data;
            var status = data.status;
            if (status == 1) {

              toast.dismiss(id_toast);

              setVideoURL(data.temp_video);
              setPlayingStream(true);

            } else {

              toast.update(id_toast, {render: "Error loading video", type: "warning", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });

            }
        })
        .catch(function (error) {
            const message = error.response.data.message ? error.response.data.message : "Something went wrong";
            toast.update(id_toast, {render: message, type: "error", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
            console.log(error);
        })
  };

  const handleClickDisplay = async() => {
    if(playingStream == true) {
      setPlayingStream(false);
    } else {
      setPlayingStream(true);
    }
  };

  const onChangeHandlerFilterVideo = (event: { target: { value: React.SetStateAction<string>; }; }) => {
     setInputFilterVideo(event.target.value);
  };

  const handleFilterVideos = () => {
    const videos_filter:any = [];
    videosDB.forEach( function(video:any,index) {
      var name = video.name;
      if (name.toLowerCase().indexOf(inputFilterVideo.toLowerCase()) > -1) {
        videos_filter.push(video);
      }
    });
    setVideosList(videos_filter);
  }

  const router = useRouter();

  return (

  <LayoutPlayer>

    <div id="player-videos" className="flex flex-col flex-1">

        <div className="bg-vc-border-gradient rounded-lg p-px">
            <div className="py-6 rounded-lg">
              <div
                className="bg-vc-border-gradient inset-x-0 bottom-3 mx-3 rounded-lg p-px shadow-lg shadow-black/20 border-gray-800 border"
              >

                  <div id="div_videos" className="flex flex-col justify-between space-y-2 rounded-lg bg-black p-3.5 lg:px-5 lg:py-3">


                    <div className="flex flex flex-row">
                      <div className="mr-2" style={{ display:  playingStream == true ? "none" : "block" }}>
                        <button className="btn-table-primary">{videosList.length} videos</button>
                      </div>
                      <div style={{ display:  playingStream == true ? "none" : "block" }}>
                        <input id="search-station" type="search" className="text-black block w-full py-2 pl-10 border border-gray-300 rounded-lg sm:text-sm" placeholder="Search here"
                          onChange={onChangeHandlerFilterVideo}
                          value={inputFilterVideo}
                          onKeyPress={event => {
                            if (event.key === "Enter") {
                              handleFilterVideos();
                            }
                          }}
                        />
                      </div>
                      <div className="right-group">
                        {
                          playingStream == false &&
                            <button onClick={() =>  router.replace("/player/settings/videos")} className="btn-icon mr-2"><FontAwesomeIcon icon={faGear} /></button>
                        }
                        {
                          playingStream == true &&
                        <button onClick={() =>  handleClickDisplay() } className="btn-icon"><FontAwesomeIcon icon={faDisplay} /></button>
                        }
                      </div>
                    </div>

                    { 
                      playingStream == true && videoURL != "" &&

                        <div id="showVideo">

                          <Plyr
                            source={{
                              type: "video",
                              sources: [{ src: videoURL }],
                            }}
                            options={{
                              controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
                              hideControls: true,
                              autoplay: true,
                              loop: { active: true }
                            }}
                          />

                        </div>
                    }


                    {
                      playingStream == false &&

                        <div id="showTable">

                          <div className="scrollbar">
                              <table className="table table-hover" id="table_videos">
                                  <thead>
                                      <tr>
                                          <th scope="col">Name</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                    {videosList.map(function(video:any,index){
                                       return (
                                        <tr key={"videos_" + video.id} onDoubleClick={() => handleClickVideo(video.id)} className={(videoID === video.id ? "itemSelected" : "")}>
                                          <td>{video.name}</td>
                                        </tr>
                                      )
                                    })}
                                  </tbody>
                              </table>
                          </div>
                        </div>
                    }

                  </div>

              </div>
            </div>
        </div>

    </div>

  </LayoutPlayer>

  );

};

export default useAuth(ListVideo);
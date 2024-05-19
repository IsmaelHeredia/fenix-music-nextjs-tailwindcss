"use client";

import LayoutPlayer from "@/components/LayoutPlayer";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPencil, faTrash, faDisplay } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import {Howl, Howler} from 'howler';

import { useRouter } from "next/navigation";

import dynamic from "next/dynamic";

const Plyr = dynamic(() => import("plyr-react"), { ssr: false });

import "plyr-react/plyr.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useAuth from "@/components/useAuth";

const ListStream = () => {

  const [streamsDB, setStreamsDB] = useState([]);

  const [streamsList, setStreamsList] = useState([]);

  const [streamID, setStreamID] = useState<any>();

  const [streamData, setStreamData] = useState<any>();

  const [inputFilterStream, setInputFilterStream] = useState("");

  const [playingVideo, setPlayingVideo] = useState(false);

  const [videoURL, setVideoURL] = useState("");

  const videoRef = useRef<any>(null);
  
  useEffect(() => {

    async function loadStreams() {

      const id_toast = toast.loading("Please wait ...");

      axios
          .get(process.env.NEXT_PUBLIC_API_URL + "/streams")
          .then(response => {
              var data = response.data;
              var status = data.status;
              if (status == 1) {

                toast.dismiss(id_toast);

                const streams = data.streams;
                setStreamsDB(streams);
                setStreamsList(streams);

              }
          })
          .catch(function (error) {
              const message = error.response.data.message ? error.response.data.message : "Something went wrong";
              toast.update(id_toast, {render: message, type: "error", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
              console.log(error);
          })
    }

    loadStreams();

  }, []);

  useEffect(() => {    
    videoRef.current?.load();
  }, [videoURL]);

  const handleClickStream = async(id:any) => {
    let data_stream: any = streamsDB.find((s: { id: any; }) => s.id === id);
    setVideoURL(data_stream.link);
    setPlayingVideo(true);
  };

  const onChangeHandlerFilterStream = (event: { target: { value: React.SetStateAction<string>; }; }) => {
     setInputFilterStream(event.target.value);
  };

  const handleFilterStreams = () => {
    const streams_filter: any = [];
    streamsDB.forEach( function(stream:any,index) {
      var name = stream.name;
      if (name.toLowerCase().indexOf(inputFilterStream.toLowerCase()) > -1) {
        streams_filter.push(stream);
      }
    });
    setStreamsList(streams_filter);
  }

  const handleClickDisplay = async() => {
    if(playingVideo == true) {
      setPlayingVideo(false);
    } else {
      setPlayingVideo(true);
    }
  };

  const router = useRouter();

  return (

  <LayoutPlayer>

    <div id="player-streams" className="flex flex-col flex-1">

        <div className="bg-vc-border-gradient rounded-lg p-px">
            <div className="py-6 rounded-lg">
              <div
                className="bg-vc-border-gradient inset-x-0 bottom-3 mx-3 rounded-lg p-px shadow-lg shadow-black/20 border-gray-800 border"
              >

                  <div id="div_streams" className="flex flex-col justify-between space-y-2 rounded-lg bg-black p-3.5 lg:px-5 lg:py-3">

                    <div className="flex flex flex-row">
                      <div className="mr-2" style={{ display:  playingVideo == true ? "none" : "block" }}>
                        <button className="btn-table-primary">{streamsList.length} streams</button>
                      </div>
                      <div style={{ display:  playingVideo == true ? "none" : "block" }}>
                        <input id="search-station" type="search" className="text-black block w-full py-2 pl-10 border border-gray-300 rounded-lg sm:text-sm" placeholder="Search here"
                          onChange={onChangeHandlerFilterStream}
                          value={inputFilterStream}
                          onKeyPress={event => {
                            if (event.key === "Enter") {
                              handleFilterStreams();
                            }
                          }}
                        />
                      </div>
                      <div className="right-group">
                        {
                          playingVideo == false &&
                            <button onClick={() =>  router.replace("/player/streams/new")} className="btn-icon mr-2"><FontAwesomeIcon icon={faPlus} /></button>
                        }
                        {
                          playingVideo == true &&
                        <button onClick={() =>  handleClickDisplay()} className="btn-icon"><FontAwesomeIcon icon={faDisplay} /></button>
                        }
                      </div>
                    </div>


                    { 
                      playingVideo == true && videoURL != "" &&

                        <div id="showVideo">

                          <Plyr
                            source={{
                              type: "video",
                              sources: [
                                {
                                  src: videoURL,
                                  provider: "youtube"
                                }
                              ]
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
                      playingVideo == false &&

                        <div id="showTable">
                          <div className="scrollbar">
                              <table className="table table-hover" id="table_streams">
                                  <thead>
                                      <tr>
                                          <th scope="col">Name</th>
                                          <th scope="col">Categories</th>
                                          <th scope="col">Option</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                    {streamsList.map(function(stream:any,index){
                                       return (
                                        <tr key={"streams_" + stream.id} onDoubleClick={() => handleClickStream(stream.id)} className={(streamID === stream.id ? "itemSelected" : "")}>
                                          <td>{stream.name}</td>
                                          <td>{stream.categories}</td>
                                          <td>
                                            <button onClick={() =>  router.replace("/player/streams/edit/" + stream.id)} className="btn-icon mr-2"><FontAwesomeIcon icon={faPencil} /></button>
                                            <button onClick={() =>  router.replace("/player/streams/delete/" + stream.id)} className="btn-icon"><FontAwesomeIcon icon={faTrash} /></button>
                                          </td>
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

export default useAuth(ListStream);
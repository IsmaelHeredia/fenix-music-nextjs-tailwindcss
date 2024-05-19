"use client";

import LayoutPlayer from "@/components/LayoutPlayer";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faCirclePlay, faCircleStop, faForward, faVolumeHigh, faGear } from "@fortawesome/free-solid-svg-icons";
import { faPlus, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import {Howl, Howler} from "howler";

import Marquee from "react-fast-marquee";

import { useRouter } from "next/navigation";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useAuth from "@/components/useAuth";

const ListStation = () => {

  const [stationsDB, setStationsDB] = useState([]);

  const [stationsList, setStationsList] = useState([]);

  const [stationPlayer, setStationPlayer] = useState<any>();

  const [stationID, setStationID] = useState<any>();

  const [stationData, setStationData] = useState<any>();

  const [playingStation, setPlayingStation] = useState(false);

  const [inputFilterStation, setInputFilterStation] = useState("");
  
  useEffect(() => {

    async function loadStations() {

      const id_toast = toast.loading("Loading stations ...");

      axios
          .get(process.env.NEXT_PUBLIC_API_URL + "/stations")
          .then(response => {
              var data = response.data;
              var status = data.status;
              if (status == 1) {

                toast.dismiss(id_toast);

                const stations = data.stations;
                setStationsDB(stations);
                setStationsList(stations);
              }
          })
          .catch(function (error) {
              const message = error.response.data.message ? error.response.data.message : "Something went wrong";
              toast.update(id_toast, {render: message, type: "error", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
              console.log(error);
          })
    }

    loadStations();

  }, []);


  async function findIndexStationPlayer() {
    let id = stationID;
    let list = stationsList;
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

  async function playStation(id: any) {

    let list: any = stationsList;
    
    let data_station = list.find((s: { id: any; }) => s.id === id);

    setStationID(id);
    setStationData(data_station);

    if(stationPlayer) {
      stationPlayer.stop();
      setStationPlayer(null);
    }

    const newStation = new Howl({
      html5: true,
      format: ["mp3", "aac"],
      src:data_station.link,
      autoplay:true
    })

    setStationPlayer(newStation);

    setPlayingStation(true);
  }

  const handleClickStation = async(id: any) => {
    playStation(id);
  };

  const handleClickPlay = () => {
    if(stationPlayer) {
      stationPlayer.play();
      setPlayingStation(true);
    }
  }

  const handleClickStop = () => {
    if(stationPlayer) {
      stationPlayer.stop();
    }
    setStationPlayer(null);
    setStationID(null);
    setStationData(null);
    setPlayingStation(false);
  }

  const handleClickPrevious = async() => {
    if(stationPlayer) {
      let list = stationsList;
      let index = await findIndexStationPlayer();
      let previous_index = index - 1;
      if(typeof list[previous_index] !== "undefined") {
        let data_station: any = list[previous_index];
        playStation(data_station.id);
      } else {
        let data_station: any = list[list.length - 1];
        playStation(data_station.id);      
      }
    }
  }

  const handleClickNext = async() => {
    if(stationPlayer) {
      let list = stationsList;
      let index = await findIndexStationPlayer();
      let next_index = index + 1;
      if(typeof list[next_index] !== "undefined") {
        let data_station: any = list[next_index];
        playStation(data_station.id);
      } else {
        let data_station: any = list[0];
        playStation(data_station.id);
      }
    }
  }

  function handleUpdateVolume(e: any) {
    Howler.volume(parseInt(e.target.value, 10) / 100);
  }

  const onChangeHandlerFilterStation = (event: { target: { value: React.SetStateAction<string>; }; }) => {
     setInputFilterStation(event.target.value);
  };

  const handleFilterStations = () => {
    handleClickStop();
    const stations_filter: any = [];
    stationsDB.forEach( function(station: any,index) {
      var name = station.name;
      if (name.toLowerCase().indexOf(inputFilterStation.toLowerCase()) > -1) {
        stations_filter.push(station);
      }
    });
    setStationsList(stations_filter);
  }

  const handleClickEdit = async(id: any) => {
    handleClickStop();
    router.replace("/player/stations/edit/" + id);
  }

  const handleClickDelete = async(id: any) => {
    handleClickStop();
    router.replace("/player/stations/delete/" + id);
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

                  <div id="div_stations" className="flex flex-col justify-between space-y-2 rounded-lg bg-black p-3.5 lg:px-5 lg:py-3">

                    <div className="flex flex flex-row">
                      <div className="mr-2">
                        <button className="btn-table-primary">{stationsList.length} stations</button>
                      </div>
                      <div>
                        <input id="search-station" type="search" className="text-black block w-full py-2 pl-10 border border-gray-300 rounded-lg sm:text-sm" placeholder="Search here"
                          onChange={onChangeHandlerFilterStation}
                          value={inputFilterStation}
                          onKeyPress={event => {
                            if (event.key === "Enter") {
                              handleFilterStations();
                            }
                          }}
                        />
                      </div>
                      <div className="right-group">
                        <button onClick={() =>  router.replace("/player/settings/stations")} className="btn-icon mr-2"><FontAwesomeIcon icon={faGear} /></button>
                        <button onClick={() =>  router.replace("/player/stations/new")} className="btn-icon"><FontAwesomeIcon icon={faPlus} /></button>
                      </div>
                    </div>

                    <div className="scrollbar">
                        <table className="table table-hover" id="table_stations">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Categories</th>
                                    <th scope="col">Option</th>
                                </tr>
                            </thead>
                            <tbody>
                              {stationsList.map(function(station: any,index){
                                 return (
                                  <tr key={"stations_" + station.id} onDoubleClick={() => handleClickStation(station.id)} className={(stationID === station.id ? "itemSelected" : "")}>
                                    <td>{station.name}</td>
                                    <td>{station.categories}</td>
                                    <td>
                                      <button onClick={() =>  handleClickEdit(station.id) } className="btn-icon mr-2"><FontAwesomeIcon icon={faPencil} /></button>
                                      <button onClick={() =>  handleClickDelete(station.id) } className="btn-icon"><FontAwesomeIcon icon={faTrash} /></button>
                                    </td>
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

        <div id="player-controls">

          <div className="flex flex-row pt-6 pb-3 pl-3 items-center justify-center">

            <div id="player-info" className="flex flex-row">
              <div id="title">
                <Marquee style={{ width:  "300px" }}>{stationData ? stationData.name : "Please select station"}</Marquee>
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
              playingStation == true &&
                <button onClick={() => handleClickStop()} className="btn-player pr-2"><FontAwesomeIcon icon={faCircleStop} className="player-icons" /></button>
            }

            {
              playingStation == false &&
                <button onClick={() => handleClickPlay()} className="btn-player pr-2"><FontAwesomeIcon icon={faCirclePlay} className="player-icons" /></button>
            }

            <button onClick={() => handleClickNext()} className="btn-player pr-2"><FontAwesomeIcon icon={faForward} className="player-icons" /></button>

          </div>

        </div>

    </div>

  </LayoutPlayer>

  );

};

export default useAuth(ListStation);
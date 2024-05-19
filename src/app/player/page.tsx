"use client";

import LayoutPlayer from '@/components/LayoutPlayer';
import React, { useEffect, useState } from "react";
import { ReactElement } from "react";

import axios from "axios";

import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useAuth from "@/components/useAuth";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.color = "black";

const Home = () => {

  const [statisticsData, setStatisticsData] = useState<any>();

  useEffect(() => {

    async function loadStatistics() {

      const id_toast = toast.loading("Loading data ...");

      axios
          .get(process.env.NEXT_PUBLIC_API_URL + "/statistics")
          .then(response => {
              var data = response.data;
              var status = data.status;
              if (status == 1) {

                toast.dismiss(id_toast);

                const statistics = data.statistics[0];
                setStatisticsData(statistics);

                console.log(statistics);

              } else {

                toast.update(id_toast, {render: "Error loading data", type: "warning", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST)});

              }
          })
          .catch(function (error) {
              const message = error.response.data.message ? error.response.data.message : "Something went wrong";
              toast.update(id_toast, {render: message, type: "error", isLoading: false, autoClose: Number(process.env.NEXT_PUBLIC_TIMEOUT_TOAST) });
              console.log(error);
          })
    }

    loadStatistics();

  }, []);

  return (

  <LayoutPlayer>

    <div id="show-about" className="flex flex-col flex-1">

      <div className="bg-vc-border-gradient rounded-lg p-px">
        <div className="py-6 rounded-lg">
          <div className="bg-vc-border-gradient inset-x-0 bottom-3 mx-3 rounded-lg p-px shadow-lg shadow-black/20 border-gray-800 border form-about">
            <div className="flex flex-col justify-between space-y-2 rounded-lg bg-black p-3.5 lg:px-5 lg:py-3">
              <h2 className="text-5xl mb-3 text-white text-center">Statistics</h2>
              <div className="cardGraphic statisticsCard">
              {
                statisticsData &&
                  <Doughnut
                    data={{
                      labels: ["Playlists","Stations","Videos","Streams"],
                      datasets: [
                        {
                          label: "Count",
                          data: [statisticsData.number_playlists,statisticsData.number_stations,statisticsData.number_videos,statisticsData.number_live_streams],
                          backgroundColor: [
                            "#50C878",
                            "#1434A4",
                            "#A52A2A",
                            "#F88379",
                          ],
                          borderColor: [
                            "#50C878",
                            "#1434A4",
                            "#A52A2A",
                            "#F88379",
                          ],
                          borderWidth: [1, 1, 1, 1],
                        },
                      ],
                    }}
                    options={{
                      cutout: "80%",
                      borderRadius: 10,
                      plugins: {
                        title: {
                          text: "",
                        },
                        legend: {
                           labels: {
                             color: 'white',
                           }
                        }
                      }
                    }}
                    plugins={[
                      {
                        id: "increase-legend-spacing",
                        beforeInit(chart) {
                          const originalFit = (chart.legend as any).fit;
                          (chart.legend as any).fit = function fit() {
                            originalFit.bind(chart.legend)();
                            this.height += 30;
                          };
                        }
                      }
                    ]}

                  />
              }
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

  </LayoutPlayer>

  );

};

export default useAuth(Home);
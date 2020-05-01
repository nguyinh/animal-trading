import React, { useContext } from "react";
import { Loader } from "semantic-ui-react";
import { useParams } from "react-router-dom";

import "./TurnipTrend.css";
import { AppContext } from "../contexts";
import { WeekView, SundayView } from "../components/turnip-trend";

const TurnipTrend = () => {
  const {
    state: { currentUser, isAutoConnecting },
  } = useContext(AppContext);

  const isSunday = new Date().getDay() === 0;

  if (isAutoConnecting)
    return (
      <Loader active inline="centered" size="big" style={{ marginTop: "5rem" }}>
        Chargement de l'app <span role='img' aria-label='hold-emoji'>✋</span>
      </Loader>
    );

    // TODO: if no user do something
  return <div>{isSunday ? <SundayView /> : <WeekView />}</div>;
};

export default TurnipTrend;

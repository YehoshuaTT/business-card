import React, { useEffect, useState } from "react";
import { BusinessCardService } from "../services/httpService";
import Bcard from "../components/Bcard";

function BusinessCards({ userId }) {
  const [businessCards, setBusinessCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      const cards = await BusinessCardService.index();
      if (cards) {
        setBusinessCards(cards);
      }
    };

    fetchCards();
  }, []);

  return (
    <div className="main-cards-container">
      <div className="all-cards">
        {businessCards.map((card) => {
          return <Bcard cardInfo={card} key={card._id} userId={userId} />;
        })}
      </div>
    </div>
  );
}

export default BusinessCards;

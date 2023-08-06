import { BusinessCardService } from "../services/httpService";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import {
  Typography,
  Button,
  CardMedia,
  CardContent,
  Card,
  CardActions,
} from "@mui/material";

function Bcard({ cardInfo, userId }) {
  const [loader, setLoader] = useState(false);
  const cardRef = useRef(null);
  const businessType = useRef();
  const handleDelete = async (id) => {
    if (BusinessCardService.delete(id));
  };

  useEffect(() => {
    const resizePdfDocument = () => {
      if (cardRef.current) {
        const cardSize = cardRef.current.getBoundingClientRect();
        const bCardPdf = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: [cardSize.width + 10, cardSize.height],
        });

        bCardPdf.html(cardRef.current, {
          callback: () => {
            bCardPdf.save(
              `${businessType.current.textContent}BusinessCard.pdf`
            );
            setLoader(false);
          },
        });
      }
    };

    loader && resizePdfDocument();
  }, [loader]);

  return (
    <>
      <div className="cardoutline" style={{}} ref={cardRef}>
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            alt="Business image"
            height="140"
            image={cardInfo.image}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {cardInfo.username}
            </Typography>
            <Typography variant="h6" ref={businessType}>
              {cardInfo.businessType}
            </Typography>
            <Typography variant="body2" color="text.primary">
              {cardInfo.firstName}
            </Typography>
            <Typography variant="body2" color="text.primary">
              {cardInfo.lastName}
            </Typography>
            <Typography variant="body2" color="text.primary">
              {cardInfo.phoneNumber}
            </Typography>
          </CardContent>
          <CardActions>
            {!loader ? (
              <>
                <Button
                  size="small"
                  onClick={() => window.open(`mailto:${cardInfo.email}`)}
                >
                  Email
                </Button>
                <Link to={cardInfo.webURL}>
                  <Button size="small">Website</Button>
                </Link>

                <Button
                  className="receipt-modal-download-button"
                  onClick={() => setLoader(true)}
                >
                  Download
                </Button>
                {userId === cardInfo.userId && (
                  <Button
                    className="receipt-modal-download-button"
                    onClick={() => handleDelete(cardInfo._id)}
                  >
                    Delete
                  </Button>
                )}
              </>
            ) : (
              <>
                <Typography align="left" variant="body2" color="text.primary">
                  {cardInfo.email + " | "}
                </Typography>
                <br />
                <Typography align="right" variant="body2" color="text.primary">
                  {cardInfo.webURL}
                </Typography>
              </>
            )}
          </CardActions>
        </Card>
      </div>
    </>
  );
}

export default Bcard;

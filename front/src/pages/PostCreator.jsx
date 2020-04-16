import React, { useState, useRef } from "react";
import { createPost } from "../services";
import { Button, Segment, Header, Icon, Input, Label } from "semantic-ui-react";
import { Redirect } from "react-router-dom";

const PostCreator = ({ setIsCreating }) => {
  const [shopPicture, setShopPicture] = useState(null);
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [nameError, setNameError] = useState("");
  const [publishError, setPublishError] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const inputRef = useRef(null);

  const addItemPrice = (price) => {
    const digitRegex = /^\d+$/;

    const value = price.trim();

    if (!digitRegex.test(value) && value !== '') return;

    setItemPrice(value);
  };

  const addItemToList = () => {
    if (itemName === "") {
      setNameError("Frère tu forces, indique au moins le nom de l'article");
      return;
    }

    setItems([...items, { name: itemName, price: itemPrice }]);
    setItemName("");
    setItemPrice("");
    setNameError("");
  };

  const publish = async () => {
    if (itemName && itemPrice) addItemToList();
    if (!shopPicture) {
      setPublishError(true);
      return;
    }

    setIsPublishing(true);
    await createPost(items, new Buffer(shopPicture, "utf8"));
    setIsPublishing(false);
    setIsPublished(true);

    setTimeout(() => setIsCreating(false), 1000);
  };

  const simulateInputClick = () => {
    inputRef.current.click();
  };

  const onInputChange = async (evt) => {
    const file = evt.target.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      setShopPicture(reader.result);
    };

    reader.readAsDataURL(file);
  };
  return (
    <div className="market--post-creator">
      <Header as="h2">Ton annonce du jour</Header>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onInputChange}
        style={{ visibility: "hidden", display: "none" }}
      />

      {shopPicture ? (
        <img src={shopPicture} className="shop-picture" />
      ) : (
        <Segment
          placeholder
          onClick={simulateInputClick}
          className="shop-picture--input"
          style={{ backgroundColor: publishError && "#fff6f5" }}
        >
          <Header icon>
            <Icon name="plus" />
            Ajoute une photo de ton shop 📸
          </Header>
        </Segment>
      )}

      <div className="market-items--creator">
        <Header as="h3">Ajoute tes articles</Header>

        {items.map(({ name, price }) => (
          <div className="market-items--input">
            <div className="market-items--creator--item">
              <span className="market-items--creator--item-name">{name}</span>
              {price && (
                <span className="market-items--creator--item-price">{`${price}$`}</span>
              )}
            </div>
            <Button
              icon
              color="red"
              onClick={() =>
                setItems(items.filter((item) => item.name !== name))
              }
            >
              <Icon name="minus" />
            </Button>
          </div>
        ))}

        <div className="market-items--input-with-error">
          <div className="market-items--input">
            <Input
              icon="tag"
              iconPosition="left"
              placeholder="Nom article"
              value={itemName}
              error={nameError}
              onChange={(_, { value }) => setItemName(value)}
            />
            <Input
              icon="dollar"
              iconPosition="left"
              placeholder="Prix"
              className="market-items--price-input"
              value={itemPrice}
              onChange={(_, { value }) => addItemPrice(value)}
            />
            <Button icon color="olive" onClick={addItemToList}>
              <Icon name="plus" />
            </Button>
          </div>
          {nameError && <span>{nameError}</span>}
        </div>

        <Button
          icon={isPublished}
          fluid
          primary
          size="huge"
          color={isPublished ? "green" : "blue"}
          className="market-items--publish"
          onClick={publish}
          loading={isPublishing}
          disabled={isPublishing || isPublished}
        >
          {isPublished ? <Icon name="check" /> : "Publier"}
        </Button>
      </div>
    </div>
  );
};

export default PostCreator;

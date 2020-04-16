import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../contexts";
import {
  getDailyPosts,
  bookItem,
  unbookItem,
  bookPost,
  unbookPost,
} from "../services";
import {
  Button,
  Header,
  Divider,
  Loader,
} from "semantic-ui-react";
import PostCreator from "./PostCreator";

const days = new Array(
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi"
);
const months = new Array(
  "Janvier",
  "Fevrier",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Aout",
  "Septembre",
  "Octobre",
  "Novembre",
  "Decembre"
);

const Market = () => {
  const {
    state: { currentUser },
  } = useContext(AppContext);

  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [itemLoading, setItemLoading] = useState(null);
  const [postLoading, setPostLoading] = useState(null);

  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      let posts = await getDailyPosts();

      posts = posts.map((post) => ({
        ...post,
        shopPictureSrc: Buffer.from(post.shopPicture.data, "base64"),
      }));

      setPosts(posts);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemBooking = async (itemId) => {
    setItemLoading(itemId);
    try {
      const updatedItem = await bookItem(itemId);

      setPosts(
        posts.map((post) => ({
          ...post,
          items: post.items.map((item) =>
            item._id === itemId ? updatedItem : item
          ),
        }))
      );
    } catch (err) {
      console.log(err);
    } finally {
      setItemLoading(null);
    }
  };

  const handleItemUnbooking = async (itemId) => {
    setItemLoading(itemId);
    try {
      const updatedItem = await unbookItem(itemId);

      setPosts(
        posts.map((post) => ({
          ...post,
          items: post.items.map((item) =>
            item._id === itemId ? updatedItem : item
          ),
        }))
      );
    } catch (err) {
      console.log(err);
    } finally {
      setItemLoading(null);
    }
  };

  const handlePostBooking = async (postId) => {
    setPostLoading(postId);
    try {
      const updatedPost = await bookPost(postId);

      setPosts(posts.map((post) => post._id === postId ? { ...post, ...updatedPost } : post));
    } catch (err) {
      console.log(err);
    } finally {
      setPostLoading(null);
    }
  };

  const handlePostUnbooking = async (postId) => {
    setPostLoading(postId);
    try {
      const updatedPost = await unbookPost(postId);

      setPosts(
        posts.map((post) => post._id === postId ? { ...post, ...updatedPost } : post)
      );
    } catch (err) {
      console.log(err);
    } finally {
      setPostLoading(null);
    }
  };

  const formatDate = (date) => {
    return `${days[date.getDay()]} ${date.getDate()} ${
      months[date.getMonth()]
    } `;
  };

  const backFromCreator = () => {
    fetchPosts();
    setIsCreating(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      {" "}
      {isCreating ? (
        <PostCreator backFromCreator={backFromCreator} />
      ) : (
        <div className="market">
          <div className="market--header">
            <Header
              as="h2"
              style={{ margin: 0 }}
              className="market--header--container"
            >
              {formatDate(new Date())}
              {!!posts.length && (
                <div className="market--header--post-count">{posts.length}</div>
              )}
            </Header>
            <Button
              size="mini"
              color="olive"
              onClick={() => setIsCreating(true)}
            >
              + Créer annonce
            </Button>
          </div>
          {isLoading ? (
            <Loader
              active
              inline="centered"
              size="big"
              style={{ marginTop: "5rem" }}
            >
              Chargement des annonces ✋
            </Loader>
          ) : (
            <>
              {!!posts.length ? (
                posts.map(
                  ({
                    _id: postId,
                    author,
                    items,
                    shopPictureSrc,
                    bookings: postBookings,
                  }) => (
                    <div className="market-post" key={postId}>
                      <Header as="h3">
                        {author.pseudo === currentUser.pseudo
                          ? "Ton shop"
                          : `${author.pseudo} propose`}
                      </Header>

                      <div className="market--post--shop-picture">
                        <img src={shopPictureSrc} className="shop-picture" />
                      </div>

                      {items.length ? (
                        items.map(({ _id, name, price, bookings }) => (
                          <div className="market-items--input" key={_id}>
                            <div className="market-items--post--item">
                              <span className="market-items--creator--item-name">
                                {name}
                              </span>
                              {price && (
                                <span className="market-items--creator--item-price">{`${price}$`}</span>
                              )}
                            </div>
                            {author._id !== currentUser._id && (
                              <>
                                {bookings.some(
                                  (booking) =>
                                    booking.author === currentUser._id
                                ) ? (
                                  <Button
                                    color="orange"
                                    compact
                                    loading={itemLoading === _id}
                                    disabled={itemLoading === _id}
                                    onClick={() => handleItemUnbooking(_id)}
                                  >
                                    ❌ Annuler
                                  </Button>
                                ) : (
                                  <Button
                                    color="teal"
                                    compact
                                    loading={itemLoading === _id}
                                    disabled={itemLoading === _id}
                                    onClick={() => handleItemBooking(_id)}
                                  >
                                    👈 I want it
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="market-items--no-item">
                          {author._id !== currentUser._id && (
                            <>
                              {postBookings.some(
                                (booking) => booking.author === currentUser._id
                              ) ? (
                                <Button
                                  color="orange"
                                  compact
                                  size="large"
                                  loading={postLoading === postId}
                                  disabled={postLoading === postId}
                                  onClick={() => handlePostUnbooking(postId)}
                                >
                                  ❌ Annuler
                                </Button>
                              ) : (
                                <Button
                                  color="teal"
                                  compact
                                  size="large"
                                  loading={postLoading === postId}
                                  disabled={postLoading === postId}
                                  onClick={() => handlePostBooking(postId)}
                                >
                                  I want something 🙏
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      )}
                      <Divider style={{ margin: "3rem 3rem 2rem" }} />
                    </div>
                  )
                )
              ) : (
                <div className="no-data">
                  Pas d'annonce pour le moment, créé en une 👆
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Market;

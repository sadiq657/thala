import { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const TripList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user?._id);
  const tripList = useSelector((state) => state.user?.tripList || []);

  const dispatch = useDispatch();

  const getTripList = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}/trips`);
      if (!response.ok) throw new Error("Failed to fetch trip list");
      
      const data = await response.json();
      dispatch(setTripList(data));
    } catch (err) {
      console.error("Fetch Trip List failed!", err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (tripId) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}/trips/${tripId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Delete failed");
      }

      dispatch(setTripList(tripList.filter((trip) => trip._id !== tripId)));
    } catch (err) {
      console.error("Delete Trip failed!", err.message);
      alert("Failed to delete trip. Please try again.");
    }
  };

  useEffect(() => {
    getTripList();
  }, [userId]); // Ensure userId is available before fetching

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Trip List</h1>
      <div className="list">
        {tripList.length > 0 ? (
          tripList.map(({ _id, listingId, hostId, startDate, endDate, totalPrice, booking = true }) => (
            <div key={_id} className="trip-item">
              <ListingCard
                listingId={listingId._id}
                creator={hostId._id}
                listingPhotoPaths={listingId.listingPhotoPaths}
                city={listingId.city}
                province={listingId.province}
                country={listingId.country}
                category={listingId.category}
                startDate={startDate}
                endDate={endDate}
                totalPrice={totalPrice}
                booking={booking}
              />
              <button className="delete-btn" onClick={() => deleteTrip(_id)}>cancel</button>
            </div>
          ))
        ) : (
          <p className="empty-message">No trips found.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default TripList;

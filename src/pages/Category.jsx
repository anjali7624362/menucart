import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

const Category = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListings, setLastFetchedListings] = useState(null);

  const params = useParams();
  console.log(params)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get Reference
        const listingRef = collection(db, "listings");

        // Create a query
        const q = query(
          listingRef,
          where("location", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(10)
          // limit(2)
        );

        //Execute Query
        const querySnap = await getDocs(q);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListings(lastVisible);

        const listings = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        console.log(listings)
        setLoading(false);
      } catch (error) {
        console.log(error)
        toast.error("Could not fetch listings");
      }
    };

    fetchListings();
  }, [params.categoryName]);

  //Pagination/Load More
  const onFetchMoreListings = async () => {
    try {
      // Get Reference
      const listingRef = collection(db, "listings");

      // Create a query
      const q = query(
        listingRef,
        where("location", "==", params.categoryName),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListings),
        limit(10)
      );

      //Execute Query
      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListings(lastVisible);

      const listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("Could not fetch listings");
    }
  };

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {/* {params.categoryName === "bailey-road" ? "Mess in Bailey Road" : 
          "Mess in Boring Road"  } */}
          {params.categoryName === "bailey-road" && "Mess in Bailey Road"}
          {params.categoryName === "boring-road" && "Mess in Boring Road"}
          {params.categoryName === "kankadbagh" && "Mess in Kankarbagh"}
          {params.categoryName === "kadamkuan" && "Mess in kadamkuan"}
        </p>
      </header>
     

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>

          <br />
          <br />
          {lastFetchedListings && (
            <p className="loadMore" onClick={onFetchMoreListings}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  );
  };


export default Category;

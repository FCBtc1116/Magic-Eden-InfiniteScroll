import { useCallback, useEffect, useState, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "./components/Card";
import "./App.css";

/*
 * Fetch Data from magic eden.
 * If failed, fetch again every 3 sec until it's success
 */

function fetchData(offset) {
  const url = `https://api-mainnet.magiceden.io/idxv2/getListedNftsByCollectionSymbol?collectionSymbol=okay_bears&limit=20&offset=${offset}`;
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .catch((error) => {
      console.log("Error:", error.message);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(fetchData(url));
        }, 1); // retry every 3 seconds
      });
    });
}

function App() {
  const offset = useRef(0);
  const [sourceData, setSourceData] = useState([]); // Fetch data
  const [filterData, setFilterData] = useState([]); // Filter data
  const [filterText, setFilterText] = useState(""); // Search Text

  /* Update Fetch Data */
  const setUpdateData = (data) => {
    const updateData = data.map(({ img, title, price }) => ({
      img,
      title,
      price,
    }));
    setSourceData((prev) => [...prev, ...updateData]);
  };

  /* Set Filter Data */
  const updateFilterData = useCallback(() => {
    console.log(sourceData);
    // To Prevent so many re-renders if user input quickly
    const filteredData = sourceData.filter(({ title, price }) =>
      (title + price).toLowerCase().includes(filterText.toLowerCase())
    ); // Simplified filtering logic
    console.log(filteredData);
    setFilterData(filteredData);
  }, [sourceData, filterText]);

  /* Fetch Update Data depend on offset */
  const updateData = () => {
    console.log(offset.current);
    if (filterText === "") {
      fetchData(offset.current)
        .then((data) => setUpdateData(data.results))
        .catch((error) => console.log("Error:", error.message));
      offset.current += 20;
    }
  };

  useEffect(() => {
    return () => {
      updateData(); //Call Only One Time
    };
  }, []);

  useEffect(() => {
    updateFilterData();
  }, [sourceData]);

  return (
    <div className="container mx-auto mt-[40px]">
      <div className="flex justify-center">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-w-lg mx-auto"
          type="text"
          placeholder="Search Box"
          onChange={(e) => {
            setFilterText(e.target.value);
          }}
          onKeyUp={updateFilterData}
        />
      </div>

      <InfiniteScroll
        dataLength={sourceData.length}
        next={updateData}
        hasMore={true}
        loader={filterText === "" && <h4>Loading...</h4>}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4 2xl:grid-cols-6 4xl:grid-cols-8 p-[40px]">
          {filterData.map((item, index) => (
            <Card
              img={item.img}
              title={item.title}
              price={item.price}
              key={index}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default App;

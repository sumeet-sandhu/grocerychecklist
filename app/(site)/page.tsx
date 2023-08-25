"use client"

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Pencil, Plus, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { NextResponse } from "next/server";

export default function Home() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allItems, setAllItems] = useState<{name:string, quantity:string, measurement:string, isEditing: boolean}[]>([]);
  const [itemName,setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemMeasurement, setItemMeasurement] = useState("");
  const [allPurchased, setAllPurchased] = useState<{name:string, quantity:string, measurement:string}[]>([]);;

  const handleAddItem = () => {
    let newItem = {
      name: itemName,
      quantity: itemQuantity,
      measurement: itemMeasurement,
      isEditing: false
    }

    // Validation: Check if item name is empty
    if(newItem.name === "") {
      alert("Please enter Item name");
      return new NextResponse("Item name is required", { status: 400 });
    }
    
    // Validation: Check if quantity is negative
    if (parseInt(newItem.quantity) < 0) {
      alert("Quantity cannot be negative");
      return new NextResponse("Quantity cannot be negative", { status: 400 });
    } 
    
    // Update the grocery list with the new item and Store the updated list in local storage
    let updatedGroceryList = [...allItems];
    updatedGroceryList.push(newItem);
    setAllItems(updatedGroceryList);
    localStorage.setItem("grocerylist", JSON.stringify(updatedGroceryList));

    // Clear the input fields
    setItemName("");
    setItemQuantity("");
    setItemMeasurement("");
  };

  const handleEditItem = (index: number) => {
    let updatedItems = [...allItems];
    updatedItems[index].isEditing = true;
    setAllItems(updatedItems);
  };

  const handleEditInputChange = (
    index: number,
    field: string,
    value: string
  ) => {
    let updatedItems = [...allItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setAllItems(updatedItems);
  };
  

  const handleSaveItem = (index: number) => {
    let updatedItems = [...allItems];
    updatedItems[index].isEditing = false;
    setAllItems(updatedItems);
    localStorage.setItem("grocerylist", JSON.stringify(updatedItems));
  };

  const handleDeleteItem = (index: number) => {
    let reducedAllItems = [...allItems];
    reducedAllItems.splice(index,1);

    localStorage.setItem('grocerylist', JSON.stringify(reducedAllItems));
    setAllItems(reducedAllItems);
  }

  const handlePurchased = (index: number) => {
    let filteredItem = {...allItems[index]}
    let updatedAllPurchased = [...allPurchased];
    updatedAllPurchased.push(filteredItem)
    setAllPurchased(updatedAllPurchased)
    handleDeleteItem(index)
    localStorage.setItem('purchasedlist', JSON.stringify(updatedAllPurchased));
  }

  const handleDeletePurchasedItem = (index: number) => {
    let reducedAllPurchased = [...allPurchased];
    reducedAllPurchased.splice(index,1);

    localStorage.setItem('purchasedlist', JSON.stringify(reducedAllPurchased));
    setAllPurchased(reducedAllPurchased);
  }

  // Function to mark all items as purchased
  const handleMarkAllPurchased = () => {
    const updatedAllPurchased = [...allPurchased, ...allItems];
    setAllPurchased(updatedAllPurchased);
    setAllItems([]);
    localStorage.setItem('purchasedlist', JSON.stringify(updatedAllPurchased));
    localStorage.setItem('grocerylist', JSON.stringify([]));
  };

  // Function to clear all items
  const handleClearAllItems = () => {
    setAllItems([]);
    localStorage.setItem('grocerylist', JSON.stringify([]));
  };

  const handleClearAllPurchased = () => {
    setAllPurchased([]);
    localStorage.setItem('purchasedlist', JSON.stringify([]));
  };


  useEffect(()=>{
    let savedGroceryList = JSON.parse(localStorage.getItem('grocerylist')!);
    let savedPurchasedList = JSON.parse(localStorage.getItem('purchasedlist')!);
    if (savedGroceryList) {
      setAllItems(savedGroceryList);
    }
    if (savedPurchasedList) {
      setAllPurchased(savedPurchasedList);
    }
  },[])
  return (
    <div className="relative bg-amber-100">
      {/* <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80]">
        <Sidebar />
      </div> */}
      <Header />
      <main className="h -screen space-y-4">
        <div className="py-2 flex flex-row justify-center items-end space-x-6 bg-green-900 h-fit w-full">
          <div>
            <label className="text-white">Item Name:</label>
            <Input value={itemName} onChange={(e)=>setItemName(e.target.value)} type="text" placeholder="Write a grocery item here" className="outline-none focus-visible:ring-0 focus-visible:ring-transparent"/>
          </div>

          <div>
            <label className="text-white">Quantity:</label>
            <Input value={itemQuantity} onChange={(e)=>setItemQuantity(e.target.value)} type="text" placeholder="Write a quantity here" className="outline-none focus-visible:ring-0 focus-visible:ring-transparent"/>
          </div>

          <div>
            <label className="text-white">Measurement:</label>
            <Input value={itemMeasurement} onChange={(e)=>setItemMeasurement(e.target.value)} type="text" placeholder="Write a measurement here" className="outline-none focus-visible:ring-0 focus-visible:ring-transparent"/>
          </div>
          
          <Button type="submit" className="col-span-12 lg:col-span-2 bg-green-500 hover:bg-green-600" onClick={handleAddItem}>
            <Plus className="h-4 w-4"/> Add Item
          </Button>
        </div>
        
        <div className="flex flex-row justify-center">
        <div className="flex justify-between w-10/12">
          <div className="space-x-2 flex flex-row justify-center">
            <Button className={(isCompleteScreen ? "bg-black hover:bg-green-800" : "bg-green-500 hover:bg-green-800")} onClick = {()=>setIsCompleteScreen(false)}>Grocery Items</Button>
            <Button className={(isCompleteScreen ? "bg-green-500 hover:bg-green-800" : "bg-black hover:bg-green-800")} onClick = {()=>setIsCompleteScreen(true)}>Purchased</Button>
          </div>

          <div>
            {isCompleteScreen === false && allItems.length !== 0 && (
              <div className="flex justify-center space-x-2">
                <Button className="bg-green-500 hover:bg-green-600" onClick={handleMarkAllPurchased}>
                  Mark All Purchased
                </Button>
                <Button className="bg-red-500 hover:bg-red-600" onClick={handleClearAllItems}>
                  Clear All Items
                </Button>
              </div>
            )}

            {isCompleteScreen === true && allPurchased.length !== 0 && (
              <div className="flex px-4 justify-center space-x-2">
                <Button className="bg-red-500 hover:bg-red-600" onClick={handleClearAllPurchased}>
                  Clear All Items
                </Button>
              </div>
            )}
          </div>
        </div>
        </div>

        <div className="flex flex-row justify-center items-center">
          <div className="bg-white w-10/12 flex flex-col justify-center space-y-2 rounded-lg m-4 mt-0 p-4">
            {/*Nothing in Grocery List*/}
            {isCompleteScreen === false && allItems.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-lg text-gray-600">Your grocery list is empty.</p>
                <p className="text-sm text-gray-400">Start adding items by using the form above.</p>
              </div>
            )}
            {/*Nothing in Purchased List*/}
            {isCompleteScreen === true && allPurchased.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-lg text-gray-600">You have not yet purchased anything</p>
                <p className="text-sm text-gray-400">Start checking items you buy from the grocery list and they will appear here.</p>
              </div>
            )}

            {isCompleteScreen === false &&
              allItems.map((item, index) => {
                return (
                  <div className="flex flex-row justify-between items-end" key={index}>
                    {item.isEditing ? (
                      // Editing Field for Name
                      <div>
                        <label className="text-green-800">Item Name:</label>
                        <Input
                          id={`name-${index}`}
                          value={item.name}
                          onChange={(e) =>
                            handleEditInputChange(index, "name", e.target.value)
                          }
                          type="text"
                          placeholder="Write a grocery item here"
                          className="outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        />
                      </div>
                    ) : (
                      // Display Item Name
                      <p>{item.name}</p>
                    )}

                    {/* Quantity and Measurement */}
                    <div key={index} className="flex flex-row space-x-4 text-green-800">
                      {item.isEditing ? (
                        // Editing Field for Quantity and Measurement
                        <>
                          <div>
                            <label className="text-green-800">Quantity:</label>
                            <Input
                              id={`quantity-${index}`}
                              value={item.quantity}
                              onChange={(e) =>
                                handleEditInputChange(
                                  index,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              type="text"
                              placeholder="Write a quantity here"
                              className="outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                            />
                          </div>

                          <div>
                            <label className="text-green-800">Measurement:</label>
                            <Input
                              id={`measurement-${index}`}
                              value={item.measurement}
                              onChange={(e) =>
                                handleEditInputChange(
                                  index,
                                  "measurement",
                                  e.target.value
                                )
                              }
                              type="text"
                              placeholder="Write a measurement here"
                              className="outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                            />
                          </div>
                        </>
                      ) : (
                        // Display Quantity and Measurement
                        <>
                          <p>{item.quantity}</p>
                          <p>{item.measurement}</p>
                        </>
                      )}
                    </div>

                    <div className="flex flex-row space-x-4">
                      {item.isEditing ? (
                        // Only display Save button during Editing
                        <Button type="submit" className="col-span-12 lg:col-span-2 bg-yellow-500 hover:bg-yellow-600" onClick={() => handleSaveItem(index)}>
                          Save
                        </Button>
                      ) : (
                        // Default view when we are not editing
                        <>
                          <Button className="bg-yellow-400 hover:bg-yellow-500 h-8 w-fit" onClick={() => handleEditItem(index)}>
                            <Pencil className="bg-auto bg-transparent hover:bg-transparent hover:cursor-pointer h-4 w-4"/>
                          </Button>
                          <Button className="bg-red-500 hover:bg-red-600 h-8 w-fit" onClick={()=>handleDeleteItem(index)}>
                            <Trash className="bg-auto bg-transparent hover:bg-transparent hover:cursor-pointer h-4 w-4"/>
                          </Button>
                          <Button className="bg-green-500 hover:bg-green-600 h-8 w-fit" onClick={()=>handlePurchased(index)}>
                            <Check className="bg-auto bg-transparent hover:bg-transparent hover:cursor-pointer h-4 w-4"/>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

            {isCompleteScreen === true &&
              allPurchased.map((item, index) => {
                return (
                  <div className="flex flex-row justify-between items-end" key={index}>
                    
                    <p>{item.name}</p>

                    <div key={index} className="flex flex-row space-x-4 text-green-800">
                      <p>{item.quantity}</p>
                      <p>{item.measurement}</p>
                    </div>

                    <div className="flex flex-row space-x-2">
                      <Button className="bg-red-500 hover:bg-red-600 h-8 w-fit" onClick={()=>handleDeletePurchasedItem(index)}>
                        <Trash className="bg-auto bg-transparent hover:bg-transparent hover:cursor-pointer h-4 w-4"/>
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </main>
    </div>
  );
}
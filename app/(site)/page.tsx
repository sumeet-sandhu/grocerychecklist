"use client"

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Plus, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { NextResponse } from "next/server";

export default function Home() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allItems, setAllItems] = useState<{name:string, quantity:string, measurement:string}[]>([]);
  const [itemName,setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemMeasurement, setItemMeasurement] = useState("");
  const [allPurchased, setAllPurchased] = useState<{name:string, quantity:string, measurement:string}[]>([]);;

  const handleAddItem = () => {
    let newItem = {
      name: itemName,
      quantity: itemQuantity,
      measurement: itemMeasurement
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
        <div className="py-2 flex flex-row justify-center items-end space-x-6 bg-green-800 h-fit w-full">
          <div>
            <label className="text-white">Item Name:</label>
            <Input id="name" value={itemName} onChange={(e)=>setItemName(e.target.value)} type="text" placeholder="Write a grocery item here" className="outline-none focus-visible:ring-0 focus-visible:ring-transparent"/>
          </div>

          <div>
            <label className="text-white">Quantity:</label>
            <Input id="quantity" value={itemQuantity} onChange={(e)=>setItemQuantity(e.target.value)} type="text" placeholder="Write a quantity here" className="outline-none focus-visible:ring-0 focus-visible:ring-transparent"/>
          </div>

          <div>
            <label className="text-white">Measurement:</label>
            <Input id="measurement" value={itemMeasurement} onChange={(e)=>setItemMeasurement(e.target.value)} type="text" placeholder="Write a measurement here" className="outline-none focus-visible:ring-0 focus-visible:ring-transparent"/>
          </div>
          
          <Button type="submit" className="col-span-12 lg:col-span-2 bg-green-500 hover:bg-green-600" onClick={handleAddItem}>
            <Plus className="h-4 w-4"/> Add Item
          </Button>
        </div>

        <div className="px-4 space-x-2 flex flex-row justify-center">
          <Button className={(isCompleteScreen ? "bg-black hover:bg-green-800" : "bg-green-500 hover:bg-green-800")} onClick = {()=>setIsCompleteScreen(false)}>Grocery Items</Button>
          <Button className={(isCompleteScreen ? "bg-green-500 hover:bg-green-800" : "bg-black hover:bg-green-800")} onClick = {()=>setIsCompleteScreen(true)}>Purchased</Button>
        </div>

        <div className="flex flex-row justify-center items-center">
          <div className="bg-white w-6/12 flex flex-col justify-center space-y-2 rounded-lg m-4 mt-0 p-4">
            {isCompleteScreen===false && allItems.map((item, index)=>{
              return(
                <div className="flex flex-row justify-between items-end">
                  <p>{item.name}</p>

                  <div key={index} className="flex flex-row space-x-4 text-green-800">
                    <p>{item.quantity}</p>
                    <p>{item.measurement}</p>
                  </div>
                  <div className="flex flex-row space-x-4">
                    <Trash color="red" className="bg-auto bg-transparent hover:bg-transparent hover:cursor-pointer h-4 w-4" onClick={()=>handleDeleteItem(index)}/>
                    <Check color="green" className="bg-auto bg-transparent hover:bg-transparent hover:cursor-pointer h-4 w-4" onClick={()=>handlePurchased(index)}/>
                  </div>
                </div>
              )
            })}

            {isCompleteScreen===true && allPurchased.map((item, index)=>{
              return(
                <div className="flex flex-row justify-between items-end">
                  <p>{item.name}</p>

                  <div key={index} className="flex flex-row space-x-4 text-green-800">
                    <p>{item.quantity}</p>
                    <p>{item.measurement}</p>
                  </div>
                  <div className="flex flex-row space-x-2">
                    <Trash color="red" className="bg-auto bg-transparent hover:bg-transparent hover:cursor-pointer h-4 w-4" onClick={()=>handleDeletePurchasedItem(index)}/>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
      </main>
    </div>
    
  )
}



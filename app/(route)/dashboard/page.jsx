import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserListing from "./components/userListing";

function Dashboard() {
  return (
    <div className="mt-16">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <Tabs defaultValue="Listing" className="mt-5 ">
        <TabsList className="bg-tertiary">
          <TabsTrigger value="Listing" className="bg-white">Listing</TabsTrigger>
          <TabsTrigger value="Purchase" className="bg-white">Purchase</TabsTrigger>
        </TabsList>
        <TabsContent value="Listing">
          <UserListing />
        </TabsContent>
        <TabsContent value="Purchase">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}

export default Dashboard;

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Inbox,
  Tag,
  Zap,
  Search,
  Moon,
  Sun,
  SortDesc,
  ListFilter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAxios from "../hooks/useAxios";
import { Loading } from "./loading";
import { useQuery } from "react-query";
import NotFoundSearch from "./NotFoundSearch";
import { api_url } from "../constant/global";

export default function IntelligentEmailAgent() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("timestamp");
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isLoading,setIsLoading] = useState(true)
  const [emails,setEmails] = useState([])
  const [empty,setEmpty] = useState(false)
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    getEmails()
    setIsLoading(false)
  }, [darkMode]);

  const getEmails = async () => {
    // const axios = useAxios();
    // const response = await axios.get("all_emails");
    // setEmails(response.data.data.emails)

    const { response , error } = await useAxios({ 
      url:'all_emails',
      cache:true,
      method:'GET'
    });
  
    setEmails(response.data.emails)
    if(error) setEmpty(false)
  };

  const filterEmails = emails.filter(
    (email) =>
      email?.sender?.toLowerCase().includes(searchValue.toLowerCase()) ||
      email?.preview?.toLowerCase().includes(searchValue.toLowerCase())
  );

  // const filteredAndSortedEmails = useMemo(() => {
  //   return emails
  //     .filter(
  //       (email) =>
  //         (filter === "All" || email.category === filter) &&
  //         (searchTerm === "" ||
  //           email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //           email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //           email.preview.toLowerCase().includes(searchTerm.toLowerCase()))
  //     )
  //     .sort((a, b) => {
  //       switch (sortBy) {
  //         case "sender":
  //           return a.sender.localeCompare(b.sender);
  //         case "subject":
  //           return a.subject.localeCompare(b.subject);
  //         default:
  //           return new Date(b.timestamp) - new Date(a.timestamp);
  //       }
  //     });
  // }, [emails, filter, searchTerm, sortBy]);

  return (
    <div className="flex h-screen bg-gray-100 w-screen dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 p-4 space-y-4 border-r dark:border-gray-700">
        <Button className="w-full dark:bg-blue-600 dark:text-white">
          Compose
        </Button>
        <div className="space-y-2">
          {["Inbox"].map((folder) => (
            <Button
              key={folder}
              variant="ghost"
              className="w-full justify-start"
            >
              {folder === "Inbox" && <Inbox className="mr-2 h-4 w-4" />}

              {folder}
            </Button>
          ))}
        </div>
        <div className="">
          <div className="flex gap-3 items-center ml-4">
            <hr className="dark:bg-white bg-black  w-[10%] h-[2px]" />
            <h3 className="mb-2  text-sm font-semibold">Smart Categories</h3>
            <hr className="dark:bg-white bg-black w-[20%] h-[2px]" />
          </div>
          <div className="space-y-2">
            {["Work", "Personal", "Newsletter"].map((category) => (
              <Button
                key={category}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setFilter(category)}
              >
                <Tag className="mr-2 h-4 w-4" /> {category}
              </Button>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setFilter("All")}
            >
              <ListFilter className="mr-2 h-4 w-4" /> All Emails
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold dark:text-white">
            Intelligent Inbox
          </h1>
          <div className="relative flex items-center">
            <div className="relative mr-2">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-8 w-full dark:bg-gray-700 dark:text-white"
                placeholder="Search emails..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="mr-2">
                  <SortDesc className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("timestamp")}>
                  Recent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("sender")}>
                  Sender
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("subject")}>
                  Subject
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
          </div>
        </div>

        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">Smart Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex space-x-2 justify-center">
            {[
              "Reply to emails",
              "Generate Internship Certificate",
              "Schedule Follow-ups",
            ].map((action) => (
              <Button
                key={action}
                variant="outline"
                size="sm"
                className="dark:border-gray-600 dark:text-white"
              >
                <Zap className="h-4 w-4" /> {action}
              </Button>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4  overflow-y-auto h-[calc(100vh-8rem)]">
          {isLoading ? (
            <Loading />
          ) : ( !isLoading && filterEmails.length == 0 ) ? (
            <NotFoundSearch searchValue={searchValue} />
          ) : (
            filterEmails.map((email, idx) => {
              return (
                <Card
                  key={idx}
                  className={`dark:bg-gray-800 shadow-md border-solid border-black/5 py-2 n border-[2px] ${
                    !email.read ? "bg-blue-50 dark:bg-blue-900/30" : ""
                  }`}
                >
                  <CardContent className="flex items-center p-4">
                    <div className="flex flex-col items-start">
                      <div className="flex min-w-[250px] max-w-[250px] hiddenScroll overflow-y-scroll gap-2 items-center px-2 py-2 bg-white rounded-md ">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="-pt-1">
                            {email?.sender ? email.sender[0] : "E"}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium leading-none dark:text-black">
                          {email.sender ? email.sender.split("<")[0] : "......"}
                        </p>
                      </div>
                    </div>

                    <div className="-ml-10 space-y-3 flex-1">
                      <p className="text-sm font-semibold capitalize text-muted-foreground dark:text-gray-300">
                        {email.subject ? email.subject : "pas de sujet"}
                      </p>
                      <p className="text-sm text-center  text-muted-foreground dark:text-gray-400">
                        {email.preview
                          ? email.preview.substring(0, 80) + " ..."
                          : "..."}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Badge
                        variant={
                          email.isImportant ? "destructive" : "secondary"
                        }
                        className="dark:bg-gray-700 dark:text-white"
                      >
                        {email.category}
                      </Badge>
                      <Badge
                        className={`${
                          email.read
                            ? "bg-green-800  hover:bg-green-700 dark:bg-green-800  dark:hover:bg-green-700"
                            : "bg-yellow-700 hover:bg-yellow-600"
                        } cursor-pointer dark:text-white capitalize`}
                      >
                        {email.read ? "reponded" : "pending"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

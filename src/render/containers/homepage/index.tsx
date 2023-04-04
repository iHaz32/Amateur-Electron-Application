import React from "react";
import { booksType } from "../../../../types";
import { Transition, Dialog, Menu } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { BrowserWindow } from "electron";
import binImg from "../../../../bin.jpg";
import editImg from "../../../../edit.png";

export default function App() {
  const [books, setBooks] = React.useState<Array<booksType>>([]);
  const [displayingBook, setDisplayingBook] = React.useState<booksType>();
  const [delCols, setDelCols] = React.useState(true);
  const [editCols, setEditCols] = React.useState(true);
  const [manageFilesAccess, setManageFilesAccess] = React.useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [selected, setSelected] = React.useState("");
  const [sortingMethod, setSortingMethod] = React.useState([
    books as any,
    "",
    "",
  ]); //random default useless value

  React.useEffect(() => {
    window.electron.send("getData", {});
    window.electron.receive("sentData", (data: any) => {
      sort(data, "name", "ascending");
      setBooks(data);
    });
  }, []);

  function classNames(...classes: Array<any>) {
    return classes.filter(Boolean).join(" ");
  }

  async function sort(books: any, property: string, type: string) {
    setSortingMethod([books, property, type]);
    const prosimo = type === "ascending" ? 1 : -1;
    if (property === "name") {
      const byName = books.slice(0);
      byName.sort(function (a: any, b: any) {
        const x = a.title.toLowerCase();
        const y = b.title.toLowerCase();
        return (x < y ? -1 : x > y ? 1 : 0) * prosimo;
      });
      setBooks(byName);
    } else if (property === "pages") {
      const byPages = books.slice(0);
      byPages.sort(function (a: any, b: any) {
        return (a.pages - b.pages) * prosimo;
      });
      setBooks(byPages);
    }
    setManageFilesAccess(false);
  }

  async function search(e: any) {
    e.preventDefault();
    setManageFilesAccess(false);
    setBooks(
      books.filter(
        (book) =>
          book.title.toLowerCase().includes(e.target[0].value.toLowerCase()) ||
          book.author.toLowerCase().includes(e.target[0].value.toLowerCase())
      )
    );
  }

  async function del(title: string) {
    setManageFilesAccess(true);
    setBooks(books.filter((book) => book.title !== title));
  }

  async function add(e: any) {
    setManageFilesAccess(true);
    setBooks([
      ...books,
      {
        author: e.target[1].value,
        country: e.target[2].value,
        imageLink: "",
        language: e.target[3].value,
        link: "",
        pages: Number(e.target[4].value),
        title: e.target[0].value,
        year: Number(e.target[5].value),
      },
    ]);
  }

  async function edit(e: any) {
    setManageFilesAccess(true);
    setBooks([
      ...books.filter((book) => book.title !== displayingBook?.title),
      {
        author: e.target[1].value,
        country: e.target[2].value,
        imageLink: "",
        language: e.target[3].value,
        link: "",
        pages: Number(e.target[4].value),
        title: e.target[0].value,
        year: Number(e.target[5].value),
      },
    ]);
  }

  React.useEffect(() => {
    if (books.length === 0) {
      return;
    }
    if (manageFilesAccess) {
      window.electron.send("manageBooks", books);
      sort(books, sortingMethod[1], sortingMethod[2]);
    }
  }, [books]);

  return (
    <div className="absolute flex flex-col h-full w-full">
      <div className="flex bg-[#01528A]">
        <p className="font-bold text-lg p-3">Find your book</p>
        <button
          onClick={(e) => window.electron.send("minimize-app", {})}
          className="hover:bg-[#A1A1A1] font-medium text-lg ml-auto p-3"
        >
          --
        </button>
        <button
          onClick={(e) => window.electron.send("maximize-app", {})}
          className="hover:bg-[#A1A1A1] font-medium text-lg p-3"
        >
          [ ]
        </button>
        <button
          onClick={(e) => window.electron.send("quit-app", {})}
          className="hover:bg-[#ed2020] font-medium text-lg p-3"
        >
          X
        </button>
      </div>

      <div className="flex bg-[#2994e0] justify-center items-center h-full p-8 sm:p-14 md:p-20">
        <div className="flex flex-row gap-5 sm:gap-28 items-center justify-center">
          <div className="flex flex-col p-5 border-8 border-[#01528A] bg-[#2789cf] text-sm sm:text-base md:text-large scrollbar-thin scrollbar-track-black scrollbar-thumb-white h-20 w-[250px] sm:h-56 sm:w-[500px] md:h-96 md:w-[750px]">
            <table>
              <thead>
                <Menu>
                  <Menu.Button className="px-2 flex gap-2 items-center text-xs bg-[#01528A] text-white font-medium opacity-80">
                    Sort
                    <FontAwesomeIcon icon={faArrowDown} />
                  </Menu.Button>
                  <Menu.Items className="absolute flex flex-col gap-1 w-32 h-min rounded-md bg-[#01528A] text-white shadow-lg text-xs border-2 border-black border-opacity-50">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            sort(books, "name", "ascending");
                          }}
                          className={`${
                            active &&
                            "hover:bg-blue-600 hover:cursor-pointer font-medium"
                          }`}
                        >
                          Alphabetically (A-Z)
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            sort(books, "name", "descending");
                          }}
                          className={`${
                            active &&
                            "hover:bg-blue-600 hover:cursor-pointer font-medium"
                          }`}
                        >
                          Alphabetically (Z-A)
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            sort(books, "pages", "ascending");
                          }}
                          className={`${
                            active &&
                            "hover:bg-blue-600 hover:cursor-pointer font-medium"
                          }`}
                        >
                          Pages (Ascending)
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            sort(books, "pages", "descending");
                          }}
                          className={`${
                            active &&
                            "hover:bg-blue-600 hover:cursor-pointer font-medium"
                          }`}
                        >
                          Pages (Descending)
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
                <tr>
                  <th
                    colSpan={3}
                    className="font-medium text-base sm:text-lg md:text-xl underline underline-offset-1 pb-4"
                  >
                    Books
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-ms md:text-base">
                <tr>
                  <td className="font-bold">Name</td>
                  <td className="font-bold">Author</td>
                  <td className="font-bold">Pages</td>
                </tr>
                {books.map((el) => (
                  <tr>
                    <td className="flex flex-row gap-2 whitespace-wrap lg:whitespace-nowrap items-left text-left pr-12">
                      <button
                        onClick={() => {
                          setIsConfirmOpen(true);
                          setSelected(el.title);
                        }}
                        style={{ display: delCols ? "none" : "flex" }}
                      >
                        <img
                          src={binImg}
                          width="20px"
                          height="20px"
                          className="rounded"
                        />
                      </button>
                      <button
                        onClick={() => {
                          setIsEditOpen(true);
                          setDisplayingBook(el);
                        }}
                        style={{ display: editCols ? "none" : "flex" }}
                      >
                        <img
                          src={editImg}
                          width="20px"
                          height="20px"
                          className="rounded"
                        />
                      </button>
                      <button
                        onClick={() => {
                          setIsPreviewOpen(true);
                          setDisplayingBook(el);
                        }}
                        className="hover:font-medium hover:text-blue text-left"
                      >
                        {el.title}
                      </button>
                    </td>
                    <td className="whitespace-wrap lg:whitespace-nowrap">
                      {el.author}
                    </td>
                    <td className="whitespace-wrap lg:whitespace-nowrap">
                      {el.pages}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 text-[8px] sm:text-xs md:text-sm">
            <form onSubmit={(e) => search(e)} className="flex flex-row gap-1">
              <input
                className="bg-[#01528A] border-[1px] border-white p-1 sm:p-2 md:p-3 rounded focus:bg-[#165e95ec]"
                type="text"
                placeholder="Search a book/an author.."
              ></input>
              <button
                type="submit"
                className="bg-[#01528A] font-bold rounded-lg p-1 sm:p-2 md:p-3 hover:bg-[#A1A1A1]"
              >
                SEARCH
              </button>
              <button
                className="bg-[#01528A] font-bold rounded-lg p-1 sm:p-2 md:p-3 hover:bg-[#A1A1A1]"
                onClick={(e) => location.reload()}
              >
                REFRESH
              </button>
            </form>
            <button
              onClick={() => {
                setIsAddOpen(true);
              }}
              className="bg-[#01528A] hover:bg-[#A1A1A1] font-medium text-lg p-1 sm:p-2 md:p-3 mt-6 rounded"
            >
              Add
            </button>
            <button
              onClick={() => setEditCols(!editCols)}
              className={classNames(
                "font-medium text-lg p-1 sm:p-2 md:p-3 rounded",
                editCols
                  ? "bg-[#01528A] hover:bg-[#A1A1A1]"
                  : "bg-[#063354] hover:bg-[#063354] border-2 border-black"
              )}
            >
              Edit
            </button>
            <button
              onClick={() => setDelCols(!delCols)}
              className={classNames(
                "font-medium text-lg p-1 sm:p-2 md:p-3 rounded",
                delCols
                  ? "bg-[#01528A] hover:bg-[#A1A1A1]"
                  : "bg-[#063354] hover:bg-[#063354] border-2 border-black"
              )}
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <Transition appear show={isConfirmOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsConfirmOpen(false)}
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#01528A] p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-black"
                  >
                    Are you sure?
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-900">
                      Do you want to delete this book permanently?
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-[#37fa4a] px-4 py-2 mr-4 text-sm font-medium text-gray-900 hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      onClick={() => {
                        setIsConfirmOpen(false);
                        del(selected);
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-[#ed2020] px-4 py-2 text-sm font-medium text-gray-900 hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      onClick={() => setIsConfirmOpen(false)}
                    >
                      Decline
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isPreviewOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsPreviewOpen(false)}
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#01528A] p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-extrabold leading-6 text-black"
                  >
                    <a
                      className="underline underline-offset-0 text-[#001870] hover:text-blue-500"
                      href={displayingBook?.link}
                    >
                      {displayingBook?.title}
                    </a>
                  </Dialog.Title>
                  <div className="flex flex-row">
                    <div className="p-10 flex flex-col">
                      <div className="flex flex-col">
                        <p className="text-lg font-bold">Author</p>
                        <p className="font-medium">{displayingBook?.author}</p>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-lg font-bold">Country</p>
                        <p className="font-medium">{displayingBook?.country}</p>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-lg font-bold">Language</p>
                        <p className="font-medium">
                          {displayingBook?.language}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-lg font-bold">Pages</p>
                        <p className="font-medium">{displayingBook?.pages}</p>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-lg font-bold">Year</p>
                        <p className="font-medium">{displayingBook?.year}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="bg-[#01528A] hover:bg-[#A1A1A1]"
                    onClick={() => setIsPreviewOpen(false)}
                  >
                    Go back
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isAddOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsAddOpen(false)}
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#01528A] p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-extrabold leading-6 text-black text-center"
                  >
                    Add a book
                  </Dialog.Title>
                  <form
                    onSubmit={(e) => add(e)}
                    className="flex flex-row justify-center"
                  >
                    <div className="px-10 pb-10 pt-5 flex flex-col">
                      <div className="flex flex-col">
                        <p className="text-lg font-bold">Title</p>
                        <input
                          type="text"
                          className="bg-[#2994e0] color-white text-medium rounded outline-none focus:border-2 focus:border-black"
                          required
                        />
                      </div>
                      <div className="flex flex-col mt-2">
                        <p className="text-lg font-bold">Author</p>
                        <input
                          type="text"
                          className="bg-[#2994e0] color-white text-medium rounded outline-none focus:border-2 focus:border-black"
                          required
                        />
                      </div>
                      <div className="flex flex-col mt-2">
                        <p className="text-lg font-bold">Country</p>
                        <input
                          type="text"
                          className="bg-[#2994e0] color-white text-medium rounded outline-none focus:border-2 focus:border-black"
                          required
                        />
                      </div>
                      <div className="flex flex-col mt-2">
                        <p className="text-lg font-bold">Language</p>
                        <input
                          type="text"
                          className="bg-[#2994e0] color-white text-medium rounded outline-none focus:border-2 focus:border-black"
                          required
                        />
                      </div>
                      <div className="flex flex-col mt-2">
                        <p className="text-lg font-bold">Pages</p>
                        <input
                          type="text"
                          className="bg-[#2994e0] color-white text-medium rounded outline-none focus:border-2 focus:border-black"
                          required
                        />
                      </div>
                      <div className="flex flex-col mt-2">
                        <p className="text-lg font-bold">Year</p>
                        <input
                          type="text"
                          className="bg-[#2994e0] color-white text-medium rounded outline-none focus:border-2 focus:border-black"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="mt-8 p-2 bg-[#2994e0] hover:bg-[#A1A1A1] font-bold text-large rounded"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                  <button
                    type="button"
                    className="bg-[#01528A] hover:bg-[#A1A1A1]"
                    onClick={() => setIsAddOpen(false)}
                  >
                    Go back
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isEditOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsEditOpen(false)}
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#01528A] p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-extrabold leading-6 text-black text-center"
                  >
                    Edit a book
                  </Dialog.Title>
                  <form
                    onSubmit={(e) => edit(e)}
                    className="flex flex-row justify-center"
                  >
                    <div className="px-10 pb-10 pt-5 flex flex-col">
                      <div className="flex flex-col">
                        <p className="text-lg font-bold">Title</p>
                        <input
                          type="text"
                          className="bg-[#2994e0] color-white text-medium rounded outline-none focus:border-2 focus:border-black"
                          defaultValue={displayingBook?.title}
                          required
                        />
                      </div>
                      <div className="flex flex-col mt-2">
                        <p className="text-lg font-bold">Author</p>
                        <input
                          type="text"
                          className="bg-[#2994e0] color-white text-medium rounded outline-none focus:border-2 focus:border-black"
                          defaultValue={displayingBook?.author}
                          required
                        />
                      </div>
                      <div className="flex flex-col mt-2">
                        <p className="text-lg font-bold">Country</p>
                        <input
                          type="text"
                          className="bg-[#2994e0] color-white text-medium rounded outline-none focus:border-2 focus:border-black"
                          defaultValue={displayingBook?.country}
                          required
                        />
                      </div>
                      <div className="flex flex-col mt-2">
                        <p className="text-lg font-bold">Language</p>
                        <input
                          type="text"
                          className="bg-[#2994e0] color-white text-medium rounded outline-none focus:border-2 focus:border-black"
                          defaultValue={displayingBook?.language}
                          required
                        />
                      </div>
                      <div className="flex flex-col mt-2">
                        <p className="text-lg font-bold">Pages</p>
                        <input
                          type="text"
                          className="bg-[#2994e0] color-white text-medium rounded outline-none focus:border-2 focus:border-black"
                          defaultValue={displayingBook?.pages}
                          required
                        />
                      </div>
                      <div className="flex flex-col mt-2">
                        <p className="text-lg font-bold">Year</p>
                        <input
                          type="text"
                          className="bg-[#2994e0] color-white text-medium rounded outline-none focus:border-2 focus:border-black"
                          defaultValue={displayingBook?.year}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="mt-8 p-2 bg-[#2994e0] hover:bg-[#A1A1A1] font-bold text-large rounded"
                      >
                        Submit change
                      </button>
                    </div>
                  </form>
                  <button
                    type="button"
                    className="bg-[#01528A] hover:bg-[#A1A1A1]"
                    onClick={() => setIsEditOpen(false)}
                  >
                    Go back
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

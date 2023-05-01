import React, { useState } from 'react';
import NewTicketForm from './NewTicketForm';
import TicketList from './TicketList';
import EditTicketForm from './EditTicketForm';
import TicketDetail from './TicketDetail';
import { db } from "./../firebase.js";
import { collection, addDoc, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { useEffect } from 'react';

function TicketControl() {
  const [formVisibleOnPage, setFormVisibleOnPage] = useState(false);
  const [mainTicketList, setMainTicketList] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unSubscribe = onSnapshot(
      collection(db, "tickets"),
      (collectionSnapshot) => {
        // .data() transforms ALL of a documents data into javascript object so you shorten code using spread operator
        // ALSO using .map() instead of forEach

        // const tickets = collectionSnapshot.docs.map((doc) => {
        //   return {
        //     ...doc.data(),
        //     id: doc.id
        //   };
        // });
        const tickets = [];
        collectionSnapshot.forEach((doc) => {
          tickets.push({
            names: doc.data().names,
            location: doc.data().location,
            issue: doc.data().issue,
            id: doc.id
          });
        });
        setMainTicketList(tickets);
      },
      (error) => {
        setError(error.message);
      }
    );
    return () => unSubscribe();
  }, []);

  const handleClick = () => {
    if (selectedTicket != null) {
      setFormVisibleOnPage(false);
      setSelectedTicket(null);
      setEditing(false);
    } else {
      setFormVisibleOnPage(!formVisibleOnPage);
    }
  }

  const handleDeletingTicket = async (id) => {
    await deleteDoc(doc(db, "tickets, id"));
    setSelectedTicket(null);
  }

  const handleEditClick = () => {
    setEditing(true);
  }

  const handleEditingTicketInList = async (ticketToEdit) => {
    // can also write entire function in one line rather than saving the doc reference in a variable
    // await updateDoc(doc(db, "tickets", ticketToEdit.id), ticketToEdit);
    const ticketRef = doc(db, "tickets", ticketToEdit.id);
    await updateDoc(ticketRef, ticketToEdit);
    setEditing(false);
    setSelectedTicket(null);
  }

  const handleAddingNewTicketToList = async (newTicketData) => {
    await addDoc(collection(db, "tickets"), newTicketData);
    setFormVisibleOnPage(false);
  }

  const handleChangingSelectedTicket = (id) => {
    const selection = mainTicketList.filter(ticket => ticket.id === id)[0];
    setSelectedTicket(selection);
  }

  let currentlyVisibleState = null;
  let buttonText = null; 

  if (error) {
    currentlyVisibleState = <p>There was an error: {error} </p>
  } else if (editing ) {      
    currentlyVisibleState = <EditTicketForm
      ticket = {selectedTicket}
      onEditTicket = {handleEditingTicketInList} />
    buttonText = "Return to Ticket List";
  } else if (selectedTicket != null) {
    currentlyVisibleState = <TicketDetail 
      ticket={selectedTicket} 
      onClickingDelete={handleDeletingTicket}
      onClickingEdit = {handleEditClick} />
    buttonText = "Return to Ticket List";
  } else if (formVisibleOnPage) {
    currentlyVisibleState = <NewTicketForm
      onNewTicketCreation={handleAddingNewTicketToList}/>;
    buttonText = "Return to Ticket List"; 
  } else {
    currentlyVisibleState = <TicketList
      onTicketSelection={handleChangingSelectedTicket}
      ticketList={mainTicketList} />;
    buttonText = "Add Ticket"; 
  }
  return (
    <React.Fragment>
      {currentlyVisibleState}
      {error ? null : <button onClick={handleClick}>{buttonText}</button> }
    </React.Fragment>
  );
}

export default TicketControl;


// to not use firebase auto-generated ids
// import { v4 } from 'uuid';
// import { setDoc, doc } from 'firebase/firestore;

// function TicketControl() {
//   ...
// The doc() function takes 3 arguments: the database instance, the collection name, and the unique document identifier. In the above example, we've used the uuid library's v4() function to generate a unique ID.
//   const handleAddingNewTicketToList = async (newTicketData) => {
//     await setDoc(doc(db, "tickets", v4()), newTicketData);
//     setFormVisibleOnPage(false);
//   }

//   ...
// }

// export default TicketControl;
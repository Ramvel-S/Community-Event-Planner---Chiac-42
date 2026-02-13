from rsvp_service import add_rsvp, remove_rsvp, get_event_attendees

def menu():
    while True:
        print("\n--- RSVP MENU ---")
        print("1. Add RSVP")
        print("2. Remove RSVP")
        print("3. View Event Attendees")
        print("4. Exit")

        choice = input("Enter choice: ")

        if choice == "1":
            user_id = int(input("Enter User ID: "))
            event_id = int(input("Enter Event ID: "))
            add_rsvp(user_id, event_id)

        elif choice == "2":
            user_id = int(input("Enter User ID: "))
            event_id = int(input("Enter Event ID: "))
            remove_rsvp(user_id, event_id)

        elif choice == "3":
            event_id = int(input("Enter Event ID: "))
            get_event_attendees(event_id)

        elif choice == "4":
            print("Exiting...")
            break

        else:
            print("Invalid choice. Try again.")

if __name__ == "__main__":
    menu()


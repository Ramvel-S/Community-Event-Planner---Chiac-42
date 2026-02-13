from db import get_connection

def add_rsvp(user_id, event_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        query = "INSERT INTO rsvps (user_id, event_id) VALUES (%s, %s)"
        cursor.execute(query, (user_id, event_id))
        conn.commit()

        print("RSVP added successfully!")

    except Exception as e:
        print("Error adding RSVP:", e)

    finally:
        cursor.close()
        conn.close()


def remove_rsvp(user_id, event_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        query = "DELETE FROM rsvps WHERE user_id = %s AND event_id = %s"
        cursor.execute(query, (user_id, event_id))
        conn.commit()

        print("RSVP removed successfully!")

    except Exception as e:
        print("Error removing RSVP:", e)

    finally:
        cursor.close()
        conn.close()


def get_event_attendees(event_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
        SELECT users.id, users.username, users.email
        FROM rsvps
        JOIN users ON rsvps.user_id = users.id
        WHERE rsvps.event_id = %s
        """
        cursor.execute(query, (event_id,))
        attendees = cursor.fetchall()

        print("Attendees:")
        for attendee in attendees:
            print(attendee)

    except Exception as e:
        print("Error fetching attendees:", e)

    finally:
        cursor.close()
        conn.close()


from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from db import get_db

events_bp = Blueprint("events", __name__)
from flask_jwt_extended import create_access_token

@events_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    # Temporary hardcoded check (for testing)
    if username == "zaid" and password == "1234":
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200

    return jsonify({"error": "Invalid credentials"}), 401


@events_bp.route("/events", methods=["GET"])
#@jwt_required()     # when Task 1 is ready uncomment this line to require authentication for this endpoint
def list_events():
    db = get_db()

    if db is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = db.cursor(dictionary=True)

    date = request.args.get("date")
    category = request.args.get("category")
    search = request.args.get("search")

    query = "SELECT * FROM events WHERE 1=1"
    params = []

    if date:
        query += " AND event_date = %s"
        params.append(date)

    if category:
        query += " AND category = %s"
        params.append(category)

    if search:
        query += " AND (title LIKE %s OR description LIKE %s)"
        keyword = f"%{search}%"
        params.extend([keyword, keyword])

    query += " ORDER BY event_date ASC, event_time ASC"

    try:
        cursor.execute(query, params)
        events = cursor.fetchall()

        # Convert non-JSON serializable fields
        for event in events:
            if event.get("event_date"):
                event["event_date"] = str(event["event_date"])
            if event.get("event_time"):
                event["event_time"] = str(event["event_time"])
            if event.get("created_at"):
                event["created_at"] = str(event["created_at"])

        return jsonify({
            "total_events": len(events),
            "events": events
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        db.close()

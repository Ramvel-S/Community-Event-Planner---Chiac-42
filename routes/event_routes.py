from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from db import get_db

events_bp = Blueprint("events", __name__)



@events_bp.route("/events", methods=["GET"])
@jwt_required()     
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

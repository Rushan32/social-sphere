import bagel.Image;
import bagel.Keys;

import java.util.Objects;



/**
 * The Note class represents a musical note in the ShadowDance game.
 */
public class Note {
    private Image noteImage;
    private final String noteType; // Either Hold or Regular or Special or Bomb Note
    private String noteDirection; // Either note is Up, down, left or right
    private final int xCoord; // X coordinate for Note
    private int yCoord = 100; // Fixed y-coordinate for the starting position
    private final int startFrame; // When note should be drawn
    private boolean noteActive = false; // If the note is active
    private boolean noteHit = false; // New attribute to track if the note has been hit
    private Keys noteKey;

    private double yCentre; // Centre of note
    private boolean isHold = false; // If note is a hold note
    private boolean isSpecial = false;
    private boolean isBomb = false;
    private final int ySpeed = 2; // How fast note should fall
    private final int holdMiddleDifference = 82; // Getting the bottom or top of the hold note
    // Keys for Notes
    private final String LEFT_KEY = "Left";
    private final String RIGHT_KEY = "Right";
    private final String UP_KEY = "Up";
    private final String DOWN_KEY = "Down";
    private final String DOUBLE_KEY = "DoubleScore";
    private final String SPEED_KEY = "SpeedUp";
    private final String SLOW_KEY = "SlowDown";
    // Boolean to check which special note it is
    private boolean isDoubleNote = false;
    private boolean isSlowNote = false;
    private boolean isSpeedNote = false;
    // Checking if note has been 'stolen' by an enemy
    private boolean collisioned = false;

    /**
     * Creates a new Note instance.
     *
     * @param noteType      The type of the note.
     * @param noteDirection The direction of the note.
     * @param xCoord        The X coordinate of the note.
     * @param startFrame    The frame when the note should be drawn.
     */

    public Note(String noteType, String noteDirection, int xCoord, int startFrame) { // Constructor for Note Class
        this.noteType = noteType;
        this.noteDirection = noteDirection;
        this.xCoord = xCoord;
        this.startFrame = startFrame;
        if (noteType.equals("Hold")) {
            yCoord -= holdMiddleDifference;
        }
        // Determine the corresponding arrow key for interaction
        switch (noteDirection) {
            case LEFT_KEY:
                noteKey = Keys.LEFT;
                break;
            case RIGHT_KEY:
                noteKey = Keys.RIGHT;
                break;
            case UP_KEY:
                noteKey = Keys.UP;
                break;
            case DOWN_KEY:
                noteKey = Keys.DOWN;
                break;
            case DOUBLE_KEY:
            case SPEED_KEY:
            case SLOW_KEY:
                noteKey = Keys.SPACE;
                break;
        }
    }


    /**
     * Gets the key associated with the note.
     *
     * @return The key associated with the note.
     */
    public Keys getNoteKey() { // Getter for key of note
        return noteKey;
    }

    /**
     * Updates the note based on the frame number.
     *
     * @param frameNumber     The current frame number.
     * @param additionalSpeed Additional speed applied to the notes.
     * @param affectedBomb    Indicates if a bomb has affected the note.
     * @param bombAffectedLane The lane affected by the bomb.
     */

    public void update(int frameNumber, int additionalSpeed, boolean affectedBomb, String bombAffectedLane) { // Updating note based on frame number
        if (frameNumber >= startFrame) {
            noteActive = true;
            if (affectedBomb && Objects.equals(bombAffectedLane, noteDirection)) { // Handling Bomb Note
                noteHit = true;
                noteActive = false;
            }
            if (collisioned) { // Handling if enemy hits note
                noteHit = true;
                noteActive = false;
            }
            // Accounting for speed and additional speed
            yCoord += ySpeed;
            yCoord += additionalSpeed;
        }
    }


    public void setNoteActive(boolean isNoteActive) { // Setter for if note is active
        noteActive = isNoteActive;
    }

    public boolean getNoteActive() { // Getter for if note is active
        return noteActive;
    }

    public boolean getNoteHit() { // Getter for if note has been hit
        return noteHit;
    }


    public void setNoteHit(boolean hit) { // Setter to set if note has been hit
        noteHit = hit;
    }

    /**
     * Draws the note.
     */

    public void draw() {
        if (noteActive && !noteHit) { // Only draw if the note is active and not hit
            // Drawing note type
            if (noteType.equals("Normal") || noteType.equals("Bomb")) { // Accounting for normal or bomb note
                if (noteType.equals("Bomb")) {
                    noteImage = new Image("res/note" + noteType + ".png");
                    isBomb = true;
                } else {
                    noteImage = new Image("res/note" + noteDirection + ".png");
                }
            } else if (noteType.equals("Hold")) { // Accounting for hold notes
                noteImage = new Image("res/holdNote" + noteDirection + ".png");
                isHold = true;
            } else { // Accounting for other special notes
                switch (noteDirection) {
                    case "DoubleScore":
                        noteDirection = "2x";
                        isDoubleNote = true;
                        break;
                    case "SlowDown":
                        isSlowNote = true;
                        break;
                    case "SpeedUp":
                        isSpeedNote = true;
                        break;
                }
                noteImage = new Image("res/note" + noteDirection + ".png");
                isSpecial = true;
            }
            noteImage.draw(xCoord, yCoord);
            yCentre = noteImage.getHeight();
        }
    }
    public int getYCoord() { // Getter for yCoordinate of note
        return yCoord;
    }


    public int getXCoord() { // Getter for yCoordinate of note
        return xCoord;
    }

    public Image getNoteImage() { // Getter for current note image
        return noteImage;
    }

    public double getNoteYcentre() { // Getter for centre of Y coordinate of note
        return yCentre/2;
    }

    public boolean getIsHold() { // Getter for if the note is hold or not
        return isHold;
    }
    public boolean getIsSpecial() { // Getter for if it's a special note
        return isSpecial;
    }
    public boolean getIsBomb() { // Getter for if it's a bomb note
        return isBomb;
    }

    public boolean getIsDouble() { // Getter for if it's a double note
        return isDoubleNote;
    }
    public boolean getIsSpeed() { // Getter for if it's a speed note
        return isSpeedNote;
    }
    public boolean getIsSlow() { // Getter for if it's a slow note
        return isSlowNote;
    }

    public void setCollisioned(boolean isCollided) { // Setter for if Enemy has collided with note
        collisioned = isCollided;
    }
}

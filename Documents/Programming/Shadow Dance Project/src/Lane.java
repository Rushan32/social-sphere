import bagel.Input;
import bagel.Keys;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.Queue;


/**
 * The Lane class represents a game lane in the ShadowDance game. Lanes contain notes that the player interacts with.
 */
public class Lane {
    private final String laneType; // Current Lane type
    private final int xCoord; // X coordinate for Lane
    private static final int WINDOW_HEIGHT = 768; // Height of window

    private final Queue<Note> notes = new LinkedList<>(); // Queue of all the notes
    private int totalNotes; // How many notes there are
    private final int laneYcoord = 384; // All lanes have the same Y coordinate
    private final int holdMiddleDifference = 82; // Getting the bottom or top of the hold note
    private final int missingDistance = 205; // This distance gets a miss
    private final int centreStationaryNote = 657; // Centre of the stationary notes of the lanes
    private final int specialNoteActiveDistance = 50; // Distance for which special note gets activated
    private int activatedDoubleFrame = 480; // How long a Double Score Note effect lasts for

    /**
     * Creates a new Lane instance.
     *
     * @param laneType The type of the lane.
     * @param xCoord   The X coordinate of the lane.
     */

    public Lane(String laneType, int xCoord) { // Constructor for lane class
        // Current Lane type and its coordinate
        this.laneType = laneType;
        this.xCoord = xCoord;
    }

    /**
     * Adds a new note to the lane.
     *
     * @param noteType    The type of the note.
     * @param noteDirection The direction of the note.
     * @param startFrame  The frame when the note starts.
     */
    public void addNote(String noteType, String noteDirection, int startFrame) {
        notes.add(new Note(noteType, noteDirection, xCoord, startFrame)); // Adding new note to list of notes
    }


    /**
     * Updates the notes in the lane.
     *
     * @param frameNumber      The current frame number.
     * @param game             The ShadowDance game instance.
     * @param additionalSpeed  Additional speed applied to the notes.
     * @param affectedBomb     Indicates if a bomb has affected the lane.
     * @param bombAffectsLane  The lane affected by the bomb.
     */
    public void update(int frameNumber, ShadowDance game, int additionalSpeed, boolean affectedBomb, String bombAffectsLane) {
        // Updating Notes in the lanes
        for (Note note : notes) {
            note.update(frameNumber, additionalSpeed, affectedBomb, bombAffectsLane);
        }
        // Checking if we have drawn all the notes and finishing the game if so
        if (notes.isEmpty() && totalNotes==0) {
            game.setGameFinished(true);
        }
    }

    /**
     * Draws the notes in the lane.
     */

    public void draw() {
        // Drawing the notes
        for (Note note : notes) {
            note.draw();
        }
    }

    /**
     * Handles all interactions between notes and the lane.
     *
     * @param input The input from the player.
     * @param game  The ShadowDance game instance.
     * @param enemy The enemy instance in the game.
     */

    public void handleInteractions(Input input, ShadowDance game, Enemy enemy) { // Handling all Note and Lane interactions
        Note closestNote = null;
        double closestDistance = Double.MAX_VALUE; // Value for interacting with notes closest to the end

        // Find the closest active note to the end of the screen
        totalNotes = game.getTotalNotes();
        for (Note note : notes) {
            if (note.getNoteActive()) {
                double distanceToEnd = WINDOW_HEIGHT - note.getYCoord();
                if (distanceToEnd < closestDistance) {
                    closestDistance = distanceToEnd;
                    closestNote = note;
                }
            }
        }
        // Handle interactions and scoring logic with the closest note
        if (closestNote != null) {
            // Checking what type of note the closest one is
            if (closestNote.getIsSpecial()) {
                game.setIsSpecialNote(true);
                game.setIsBombNote(false);
            } else if (closestNote.getIsBomb()) {
                game.setIsBombNote(true);
                game.setIsSpecialNote(false);
            } else {
                game.setIsSpecialNote(false);
                game.setIsBombNote(false);
            }
            Keys currKey = closestNote.getNoteKey();
            if (closestNote.getIsHold()) { // Accounting for Hold Notes
                if (closestNote.getYCoord() - holdMiddleDifference >= WINDOW_HEIGHT) {
                    // Increasing Score based on when hold note was missed
                    game.increaseScore(missingDistance);
                    closestNote.setNoteActive(false);
                    notes.remove(closestNote);
                    game.setTotalNotes(totalNotes-1); // Updating how many notes left
                }
            } else {
                if (closestNote.getYCoord() >= WINDOW_HEIGHT) { // Accounting for regular notes that have been missed
                    game.increaseScore(missingDistance);
                    closestNote.setNoteActive(false);
                    notes.remove(closestNote);
                    game.setTotalNotes(totalNotes-1);
                }
            }
            if (input.wasPressed(currKey)) { // Accounting for notes when corresponding key has been pressed
                int distance;
                if (!closestNote.getIsHold()) {
                    int middleY = (int) Math.round(closestNote.getYCoord() + closestNote.getNoteYcentre());
                    // Getting the bottom of regular notes to accurately implement when key should be pressed
                    distance = Math.abs(middleY - centreStationaryNote);
                    closestNote.setNoteHit(true); // Note has been hit
                    if (closestNote.getIsSpecial()) { // Accounting for Special Notes
                        game.setIsBombNoteActive(false);
                        if (distance<=specialNoteActiveDistance) {
                            if (closestNote.getIsDouble()) {
                                game.setDoubleScoring(true);
                                game.setIsSpeed(false);
                                game.setIsSlow(false);
                                game.setActivatedDoubleFrame(activatedDoubleFrame);
                            } else if (closestNote.getIsSpeed()) {
                                game.setIsSpeed(true);
                                game.setIsSpeedActive(true);
                                game.setIsSlow(false);
                            } else if (closestNote.getIsSlow()) {
                                game.setIsSlow(true);
                                game.setIsSlowActive(true);
                                game.setIsSpeed(false);
                            }
                        }
                    } else if (closestNote.getIsBomb()) { // Accounting for Bomb Notes
                        game.setIsBombNote(true);
                        if (distance<=specialNoteActiveDistance) {
                            game.setIsBombNoteActive(true);
                            game.setBombAffectedLane(laneType);
                        }
                    }
                    game.increaseScore(distance);

                } else {
                    // Getting bottom of hold notes for initial key press and increasing score
                    game.setIsBombNoteActive(false);
                    int bottomY = (int) Math.round(closestNote.getYCoord() + closestNote.getNoteYcentre() - holdMiddleDifference);
                    distance = Math.abs(bottomY - centreStationaryNote);
                    game.increaseScore(distance);
                    if (input.wasReleased(currKey)) {
                        // Getting top of hold notes for key release and increasing score if released well
                        int topY = (int) Math.round(closestNote.getYCoord() + closestNote.getNoteYcentre() + holdMiddleDifference);
                        distance = Math.abs(topY - centreStationaryNote);
                        game.increaseScore(distance);
                        closestNote.setNoteHit(true); // Note has been hit
                    }
                }
            }
        }
        // Handling Enemy collision with Notes
        Iterator<Note> iterator = notes.iterator();
        while (iterator.hasNext()) {
            Note note = iterator.next();
            if (enemy.checkCollision(note)) {
                note.setCollisioned(true);
                iterator.remove();  // Use iterator to safely remove the element
                notes.remove(note);
                game.setTotalNotes(totalNotes - 1);
            }
        }
        // Remove the closest note that has been hit
        if (closestNote != null && closestNote.getNoteHit()) {
            notes.remove(closestNote);
            game.setTotalNotes(totalNotes-1);
        }
    }


    public String getLaneType() { // Getter for Lane type
        return laneType;
    }

    public int getxCoord() { // Getter for the X coordinate for the lane
        return xCoord;
    }

    public int getyCoord() { // Getter for the Y coordinate for the lane
        // Fixed y-coordinate for the lane
        return laneYcoord;
    }

    public void clearQueue() { // Method that clears the queue of notes
        notes.clear();
    }
}
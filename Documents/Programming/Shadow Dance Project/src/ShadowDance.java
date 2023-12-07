import bagel.*;
import java.util.*;
import bagel.util.Point;

/**
 * The main class for the "Shadow Dance" game.
 *
 * <p>This class extends the Bagel library's AbstractGame class and represents the core functionality of the game.
 * It includes the game's initialization, update, and rendering logic.
 * The game involves rhythm-based note-matching with different types of notes and special effects.</p>
 *
 * <p>The game's window dimensions, level file names, scoring variables, fonts, images, and other configurations
 * are defined as constants or class members.</p>
 *
 * <p>Players can select levels, interact with notes, achieve scores, and experience various in-game effects.
 * The game supports multiple levels with different lane configurations and features like speed-up, slow-down,
 * double scoring, special notes, and bomb notes.</p>
 *
 * <p>After completing or failing a level, players can restart by pressing the SPACE key.</p>
 *
 * <p>Authors:
 * Rushan Qazi - 1353357</p>
 *
 */

public class ShadowDance extends AbstractGame {
    // Window Dimensions
    private static final int WINDOW_WIDTH = 1024;
    private static final int WINDOW_HEIGHT = 768;

    // File name for CSV can be changed for different levels
    private static final String LEVEL_1_FILE_NAME = "res/level1.csv";
    private static final String LEVEL_2_FILE_NAME = "res/level2.csv";
    private static final String LEVEL_3_FILE_NAME = "res/level3.csv";

    // All variables needed for Scoring
    private static final String SCORE_LABEL = "SCORE";
    private final Font SCORE_FONT = new Font("res/FSO8BITR.TTF", 30);
    private static final Point SCORE_POSITION = new Point(35, 35); // Where score will be drawn
    private final Image BACKGROUND_IMAGE = new Image("res/background.png");

    // All variables needed for Title
    private static final String GAME_TITLE = "SHADOW DANCE";
    private final Font TITLE_FONT = new Font("res/FSO8BITR.TTF", 64);
    private static final Point TITLE_POINT = new Point(220, 300); // Where Title will be drawn

    // All variables needed for the Instructions of the game
    private final Font INSTRUCTIONS_FONT = new Font("res/FSO8BITR.TTF", 24);
    private static final String SELECT_INSTRUCTIONS = "SELECT LEVELS WITH";
    private static final Point SELECT_LEVELS_POINT = new Point(320, 450);
    private static final String LEVEL_NUMBERS = "NUMBER KEYS";
    private static final Point LEVEL_NUMBERS_POINT = new Point(320, 480);
    private static final String LEVELS_TEXT = "1       2       3";
    private static final Point LEVELS_TEXT_POINT = new Point(370, 520);
    private final Image laneLeft = new Image("res/laneLeft.png");
    private final Image laneRight = new Image("res/laneRight.png");
    private final Image laneUp = new Image("res/laneUp.png");
    private final Image laneDown = new Image("res/laneDown.png");
    private final Image laneSpecial = new Image("res/laneSpecial.png");
    private Guardian guardian = new Guardian();
    private Enemy enemy = new Enemy();
    List<String[]> csvData;

    private final List<Lane> lanes = new ArrayList<>(); // List of Lanes
    private int frameCount = 0; // Counting frames
    private int score = 0; // Counting Player's Score
    private boolean gameStarted = false; // Checking if the game has started

    // All variables needed for drawing messages
    private final Font messageFont = new Font("res/FSO8BITR.TTF", 40);
    private static final Point PERFECT_MESSAGE_POSITION = new Point(420, (double) WINDOW_HEIGHT /2);
    private static final Point GOOD_MESSAGE_POSITION = new Point(460, (double) WINDOW_HEIGHT /2);
    private static final Point BAD_MESSAGE_POSITION = new Point(470, (double) WINDOW_HEIGHT /2);
    private static final Point MISS_MESSAGE_POSITION = new Point(460, (double) WINDOW_HEIGHT /2);
    private static final Point DOUBLE_MESSAGE_POSITION = new Point(385, (double) WINDOW_HEIGHT /2);
    private static final Point SPEED_MESSAGE_POSITION = new Point(400, (double) WINDOW_HEIGHT /2);
    private static final Point BOMB_MESSAGE_POSITION = new Point(410, (double) WINDOW_HEIGHT /2);
    private final int MESSAGE_FRAMES = 30; // How long a message lasts for
    private int messageFrames; // Manipulating the time the message will last for
    private String scoreMessage = "";

    // Distance needed for different scores
    private final int PERFECT_DISANCE = 15;
    private final int GOOD_DISTANCE = 50;
    private final int BAD_DISTANCE = 100;

    // What each type of score is worth
    private final int PERFECT_SCORE = 10;
    private final int GOOD_SCORE = 5;
    private final int BAD_SCORE = -1;
    private final int MISS_SCORE = -5;
    private final int SPEED_SCORE = 15;

    // Messages for type of score
    private final String PERFECT_MESSAGE = "PERFECT";
    private final String GOOD_MESSAGE = "GOOD";
    private final String BAD_MESSAGE = "BAD";
    private final String MISS_MESSAGE = "MISS";
    private final String SPEED_MESSAGE = "Speed Up";
    private final String DOUBLE_MESSAGE = "Double Score";
    private final String SLOW_MESSAGE = "Slow Down";
    private final String BOMB_MESSAGE = "Lane Clear";

    private boolean gameFinished = false; // Checking if game has been finished

    // Messages for the end of the game
    private final static String WIN_MESSAGE = "CLEAR!";
    private final static String LOSE_MESSAGE = "TRY AGAIN";
    private final Font FINISH_FONT = new Font("res/FSO8BITR.TTF", 64);
    private static final Point WIN_POSITION = new Point(380, (double) WINDOW_HEIGHT /2);
    private static final Point LOSE_POSITION = new Point(300, (double) WINDOW_HEIGHT /2);
    private final static String RETURN_TO_LEVELS = "PRESS SPACE TO RETURN TO LEVEL SELECTION";
    private final Font RETURN_FONT = new Font("res/FSO8BITR.TTF", 24);
    private static final Point RETURN_POSITION = new Point(150, 500);

    private int totalNotes = 0; // How many notes there are
    private int numberLanes; // How many lanes there are
    private final int LEVEL_1_2_LANES = 4;
    private final int LEVEL_3_LANES = 3;
    private final int LEVEL_1_WINNING_SCORE = 150;
    private final int LEVEL_2_WINNING_SCORE = 400;
    private final int LEVEL_3_WINNING_SCORE = 350;
    private int winningScore; // Score needed to win

    private boolean isLevel1 = false;
    private boolean isLevel2 = false;
    private boolean isLevel3 = false;
    private boolean isDoubleScoringActive = false;
    private int activatedDoubleFrame = 0;
    private boolean isSpecialNote = false;
    private boolean isSlowNote = false;
    private boolean isSlowActive = false;
    private boolean isSpeedNote = false;
    private boolean isSpeedActive = false;
    private boolean isBombNote = false;
    private boolean isBombNoteActive = false;
    private String bombAffectsLane = "";
    private int additionalSpeed=0;
    private final int speedNoteSpeed = 1;
    private final int slowNoteSpeed = -1;

    /**
     * Constructor for the ShadowDance class.
     *
     * <p>Creates a new instance of the game with the specified window dimensions and title.</p>
     */
    public ShadowDance() {
        super(WINDOW_WIDTH, WINDOW_HEIGHT, GAME_TITLE);
    }

    /**
     * The main method that creates a new instance of the ShadowDance game and starts its execution.
     *
     * @param args Command-line arguments (unused)
     */
    public static void main(String[] args) {
        ShadowDance game = new ShadowDance(); // New game
        game.run(); // Running game
        game.run(); // Running game
    }

    private int getLaneIndex(String laneType) {
        for (int i = 0; i < lanes.size(); i++) {
            if (lanes.get(i).getLaneType().equals(laneType)) {
                return i;
            }
        }
        return -1; // Lane not found
    }


    /**
     * Updates the game state in response to user input and game logic.
     *
     * @param input The input object that contains information about user input.
     */

    @Override
    protected void update(Input input) {
        BACKGROUND_IMAGE.draw(WINDOW_WIDTH / 2.0, WINDOW_HEIGHT / 2.0);
        if (input.wasPressed(Keys.ESCAPE)) {
          Window.close();
        }
        if (!gameStarted && !gameFinished) { // Title Screen
            // Drawing title and instructions
            TITLE_FONT.drawString(GAME_TITLE, TITLE_POINT.x, TITLE_POINT.y);
            INSTRUCTIONS_FONT.drawString(SELECT_INSTRUCTIONS, SELECT_LEVELS_POINT.x, SELECT_LEVELS_POINT.y);
            INSTRUCTIONS_FONT.drawString(LEVEL_NUMBERS, LEVEL_NUMBERS_POINT.x, LEVEL_NUMBERS_POINT.y);
            INSTRUCTIONS_FONT.drawString(LEVELS_TEXT, LEVELS_TEXT_POINT.x, LEVELS_TEXT_POINT.y);
            if (input.wasPressed(Keys.NUM_1) || input.wasPressed(Keys.NUM_2) || input.wasPressed(Keys.NUM_3)) {
                frameCount = 0;
                // Create lanes based on CSV Data Which is Based on which Level
                if (input.wasPressed(Keys.NUM_1)) {
                    csvData = readCSV(LEVEL_1_FILE_NAME);
                    isLevel1 = true;
                    isLevel2 = false;
                    isLevel3 = false;
                    numberLanes = LEVEL_1_2_LANES;
                } else if (input.wasPressed(Keys.NUM_2)) {
                    csvData = readCSV(LEVEL_2_FILE_NAME);
                    isLevel2 = true;
                    isLevel1 = false;
                    isLevel3 = false;
                    numberLanes = LEVEL_1_2_LANES;
                } else {
                    csvData = readCSV(LEVEL_3_FILE_NAME);
                    isLevel3 = true;
                    isLevel1 = false;
                    isLevel2 = false;
                    numberLanes = LEVEL_3_LANES;
                }
                totalNotes = csvData.size() - numberLanes;
                for (int i = 0; i < numberLanes; i++) {
                    String[] laneRow = csvData.get(i);
                    lanes.add(new Lane(laneRow[1], Integer.parseInt(laneRow[2])));
                }
                // Add notes to lanes
                for (int i = numberLanes; i < csvData.size(); i++) {
                    String[] noteRow = csvData.get(i);
                    int laneIndex = getLaneIndex(noteRow[0]);
                    if (laneIndex >= 0) {
                        if (Objects.equals(noteRow[0], "Special")) {
                            lanes.get(laneIndex).addNote(noteRow[0], noteRow[1], Integer.parseInt(noteRow[2]));
                        } else {
                            lanes.get(laneIndex).addNote(noteRow[1], noteRow[0], Integer.parseInt(noteRow[2]));
                        }
                    }
                }
                gameStarted = true; // Starting Game
            }
        } else if (gameStarted && !gameFinished) { // During game
            // Update and draw lanes depending on level and also setting winning score depending on level
            if (isLevel1) {
                winningScore = LEVEL_1_WINNING_SCORE;
                laneLeft.draw(lanes.get(0).getxCoord(), lanes.get(0).getyCoord());
                laneRight.draw(lanes.get(1).getxCoord(), lanes.get(1).getyCoord());
                laneUp.draw(lanes.get(2).getxCoord(), lanes.get(2).getyCoord());
                laneDown.draw(lanes.get(3).getxCoord(), lanes.get(3).getyCoord());
            } else if (isLevel2) {
                winningScore = LEVEL_2_WINNING_SCORE;
                laneSpecial.draw(lanes.get(0).getxCoord(), lanes.get(2).getyCoord());
                laneRight.draw(lanes.get(1).getxCoord(), lanes.get(1).getyCoord());
                laneLeft.draw(lanes.get(2).getxCoord(), lanes.get(0).getyCoord());
                laneDown.draw(lanes.get(3).getxCoord(), lanes.get(3).getyCoord());
            } else if (isLevel3) {
                winningScore = LEVEL_3_WINNING_SCORE;
                laneSpecial.draw(lanes.get(0).getxCoord(), lanes.get(2).getyCoord());
                laneRight.draw(lanes.get(1).getxCoord(), lanes.get(1).getyCoord());
                laneLeft.draw(lanes.get(2).getxCoord(), lanes.get(0).getyCoord());
                // Level 3 has guardian and enemy as well
                guardian.draw(this);
                enemy.draw(frameCount);
                // Guardian shooting
                if (input.wasPressed(Keys.LEFT_SHIFT)) {
                    guardian.shootArrow(enemy.getPosition());
                }
                if (guardian.getArrowActive()) {
                    guardian.update(this);
                }
            }
            // Accounting for bomb notes
            boolean affectedBomb = false;
            for (Lane lane : lanes) {
                if (isBombNoteActive) {
                    affectedBomb = true;
                }
                // Accounting for speed and slow notes
                if (isSpeedActive) {
                    if (Objects.equals(additionalSpeed, slowNoteSpeed)) {
                        additionalSpeed += speedNoteSpeed;
                    } else {
                        additionalSpeed = speedNoteSpeed;
                    }
                }
                if (isSlowActive) {
                    if (Objects.equals(additionalSpeed, speedNoteSpeed)) {
                        additionalSpeed += slowNoteSpeed;
                    } else {
                        additionalSpeed = slowNoteSpeed;
                    }
                }
                lane.update(frameCount, this, additionalSpeed, affectedBomb, bombAffectsLane); // Pass the input object to update
                lane.draw();
            }

            // Handle interactions with notes
            for (Lane lane : lanes) {
                lane.handleInteractions(input, this, enemy); // 'this' refers to the ShadowDance instance
            }
            // Drawing message for current notes
            if (messageFrames > 0) {
                if (Objects.equals(scoreMessage, PERFECT_MESSAGE)) {
                    messageFont.drawString(scoreMessage, PERFECT_MESSAGE_POSITION.x, PERFECT_MESSAGE_POSITION.y);
                } else if (Objects.equals(scoreMessage, GOOD_MESSAGE)) {
                    messageFont.drawString(scoreMessage, GOOD_MESSAGE_POSITION.x, GOOD_MESSAGE_POSITION.y);
                } else if (Objects.equals(scoreMessage, BAD_MESSAGE)) {
                    messageFont.drawString(scoreMessage, BAD_MESSAGE_POSITION.x, BAD_MESSAGE_POSITION.y);
                } else if (Objects.equals(scoreMessage, MISS_MESSAGE)) {
                    messageFont.drawString(scoreMessage, MISS_MESSAGE_POSITION.x, MISS_MESSAGE_POSITION.y);
                } else if (Objects.equals(scoreMessage, SPEED_MESSAGE)) {
                    messageFont.drawString(scoreMessage, SPEED_MESSAGE_POSITION.x, SPEED_MESSAGE_POSITION.y);
                } else if (Objects.equals(scoreMessage, DOUBLE_MESSAGE)) {
                    messageFont.drawString(scoreMessage, DOUBLE_MESSAGE_POSITION.x, DOUBLE_MESSAGE_POSITION.y);
                } else if (Objects.equals(scoreMessage, SLOW_MESSAGE)) {
                    messageFont.drawString(scoreMessage, SPEED_MESSAGE_POSITION.x, SPEED_MESSAGE_POSITION.y);
                } else if (Objects.equals(scoreMessage, BOMB_MESSAGE)) {
                    messageFont.drawString(scoreMessage, BOMB_MESSAGE_POSITION.x, BOMB_MESSAGE_POSITION.y);
                }
                messageFrames--;
            }

            // Handle message and score drawing
            SCORE_FONT.drawString(SCORE_LABEL + " " + score, SCORE_POSITION.x, SCORE_POSITION.y);

            if (activatedDoubleFrame>0) {
                activatedDoubleFrame--;
            }

            frameCount++;
        } else { // After game has ended
            // Checking if player has won or not and drawing corresponding message
            if (score >= winningScore) {
                FINISH_FONT.drawString(WIN_MESSAGE, WIN_POSITION.x, WIN_POSITION.y);
            } else {
                FINISH_FONT.drawString(LOSE_MESSAGE, LOSE_POSITION.x, LOSE_POSITION.y);
            }
            // Accounting for re-playability
            RETURN_FONT.drawString(RETURN_TO_LEVELS, RETURN_POSITION.x, RETURN_POSITION.y);
            if (input.wasPressed(Keys.SPACE)) {
                for (Lane lane : lanes) {
                    lane.clearQueue();
                }
                // Clearing everything for a new game
                csvData.clear();
                lanes.clear();
                score = 0;
                additionalSpeed = 0;
                scoreMessage= "";
                gameStarted = false;
                gameFinished = false;
                isSlowActive = false;
                isSpeedActive = false;
                isSpeedNote = false;
                isDoubleScoringActive = false;
                isBombNote = false;
                isBombNoteActive = false;
                activatedDoubleFrame = 0;
            }
        }
    }

    /**
     * Reads a CSV file for the specified level and returns the parsed data as a list of string arrays.
     *
     * @param whichLevel The level for which the CSV file should be read.
     * @return A list of string arrays representing the CSV data.
     */

    private List<String[]> readCSV(String whichLevel) {
        CSVReader csvReader = new CSVReader(whichLevel); // New csv reader
        return csvReader.readCSV(); // Reading the csv file
    }


    /**
     * Increases the player's score based on the distance from the hit point to the note.
     *
     * <p>The score is influenced by different note types, special notes, and game modifiers like double scoring.</p>
     *
     * @param distance The distance from the hit point to the note.
     */

    public void increaseScore(int distance) {
        // Checking which score the player got
         if (isSpecialNote) { // Accounting for special notes
             if (isSpeedNote) {
                 score += SPEED_SCORE;
                 displayScoreMessage(SPEED_MESSAGE);
                 isSpeedNote = false;
             } else if (isDoubleScoringActive) {
                 displayScoreMessage(DOUBLE_MESSAGE);
             } else if (isSlowNote) {
                 score += SPEED_SCORE;
                 displayScoreMessage(SLOW_MESSAGE);
                 isSlowNote = false;
             }
            return;
         }
         // Accounting for bomb notes
         if (isBombNoteActive && isBombNote) {
             displayScoreMessage(BOMB_MESSAGE);
             isBombNote = false;
             return;
         } else if (isBombNote) {
             return;
         }
        if (!isDoubleScoringActive) {
            if (distance <= PERFECT_DISANCE) {
                score += PERFECT_SCORE; // PERFECT
                displayScoreMessage(PERFECT_MESSAGE);
            } else if (distance <= GOOD_DISTANCE) {
                score += GOOD_SCORE; // GOOD
                displayScoreMessage(GOOD_MESSAGE);
            } else if (distance <= BAD_DISTANCE) {
                score += BAD_SCORE; // BAD
                displayScoreMessage(BAD_MESSAGE);
            } else {
                score += MISS_SCORE; // MISS
                displayScoreMessage(MISS_MESSAGE);
            }
        } else { // Accounting for double scoring
            if (distance <= PERFECT_DISANCE) {
                score += 2*PERFECT_SCORE; // PERFECT
                displayScoreMessage(PERFECT_MESSAGE);
            } else if (distance <= GOOD_DISTANCE) {
                score += 2*GOOD_SCORE; // GOOD
                displayScoreMessage(GOOD_MESSAGE);
            } else if (distance <= BAD_DISTANCE) {
                score += 2*BAD_SCORE; // BAD
                displayScoreMessage(BAD_MESSAGE);
            } else {
                score += 2*MISS_SCORE; // MISS
                displayScoreMessage(MISS_MESSAGE);
            }
        }
    }

    private void displayScoreMessage(String message) {
        // Displaying the frames for the score and the message that needs to be drawn
        scoreMessage = message;
        messageFrames = MESSAGE_FRAMES;
    }


    public void setGameFinished(boolean isGameFinished) {
        gameFinished = isGameFinished; // setting game to finished from Lane Class
    }

    public int getTotalNotes() { // Getter for the total amount of notes
        return totalNotes;
    }

    public void setActivatedDoubleFrame(int frame) { // Setter for double frame
        activatedDoubleFrame = frame;
    }

    public void setTotalNotes(int numNotes) { // Setter for notes remaining
        totalNotes = numNotes;
    }

    public void setDoubleScoring(boolean isDoubleScoring) { // Setter for if Double Scoring is active
        isDoubleScoringActive = isDoubleScoring;
    }

    public void setIsSpecialNote(boolean specialNoteActive) { // Setter for if it is a Special Note
        isSpecialNote = specialNoteActive;
    }
    public void setIsSlow(boolean slowNote) { // Setter if there is Slow Note
        isSlowNote = slowNote;
    }

    public void setIsSlowActive(boolean isSlowNoteActive) { // Setter for if the Slow Note is active
        isSlowActive = isSlowNoteActive;
    }
    public void setIsSpeed(boolean speedNote) { // Setter for if there is a Speed Note
        isSpeedNote = speedNote;
    }

    public void setIsSpeedActive(boolean isSpeedNoteActive) { // Setter if the Speed Note is active
        isSpeedActive = isSpeedNoteActive;
    }

    public void setIsBombNote(boolean bombNoteActive) { // Setter for if there is Bomb Note
        isBombNote = bombNoteActive;
    }
    public void setIsBombNoteActive(boolean isBombActive) { // Setter for if Bomb Note is Active
        isBombNoteActive = isBombActive;
    }

    public void setBombAffectedLane(String affectedLane) { // Setter for which lane is affected by Bomb Note
        bombAffectsLane = affectedLane;
    }

    public Enemy getEnemy() { // Getter for the current Enemy
        return enemy;
    }
}

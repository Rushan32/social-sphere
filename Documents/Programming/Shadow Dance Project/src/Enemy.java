import bagel.*;
import java.util.*;
import bagel.util.Point;
import java.util.Random;


/**
 * The Enemy class represents an enemy in the ShadowDance game. Enemies are drawn periodically,
 * move horizontally across the screen, and can collide with notes.
 */
public class Enemy {
    private final Image ENEMY_IMAGE = new Image("res/enemy.PNG"); // Image for enemy
    private final int WHEN_DRAW_ENEMY = 600; // Draw enemy every 600 frames
    // Bounds where enemies can be drawn to
    private final int RANDOM_XCOORD_BOUND = 800;
    private final int RANDOM_YCOORD_BOUND = 400;
    private final int COORD_BOUND = 100;
    private final int enemySpeed = 1;
    private int xCoord;
    private int yCoord;
    private boolean isEnemyActive = false;
    private final String RIGHT_DIRECTION = "right";
    private final String LEFT_DIRECTION = "left";
    private String currDirection;
    private final int COLLISION_DISTANCE = 104;


    /**
     * Creates a new Enemy instance.
     */
    public Enemy() { // Constructor for Enemy
    }

    /**
     * Draws the enemy on the screen. The enemy is drawn periodically based on the frame count.
     *
     * @param frameCount The current frame count of the game.
     */
    public void draw(int frameCount) { // Method that draws enemies
        if (frameCount % WHEN_DRAW_ENEMY == 0 && frameCount!=0) {
            Random random = new Random();
            // Randomly choosing enemy position
            xCoord = random.nextInt(RANDOM_XCOORD_BOUND) + COORD_BOUND;
            yCoord = random.nextInt(RANDOM_YCOORD_BOUND) + COORD_BOUND;
            ENEMY_IMAGE.draw(xCoord, yCoord);
            currDirection = random.nextBoolean() ? RIGHT_DIRECTION : LEFT_DIRECTION;
            isEnemyActive = true;
        }
        if (isEnemyActive) { // Drawing enemy and changing its direction and moving it
            ENEMY_IMAGE.draw(xCoord, yCoord);
            if (Objects.equals(currDirection, RIGHT_DIRECTION)) {
                xCoord += enemySpeed;
            } else {
                xCoord -= enemySpeed;
            }
            if (xCoord <= COORD_BOUND || xCoord >= RANDOM_XCOORD_BOUND + COORD_BOUND) {
                // Reverse the direction
                currDirection = RIGHT_DIRECTION.equals(currDirection) ? LEFT_DIRECTION : RIGHT_DIRECTION;
            }
        }
    }

    /**
     * Checks if the enemy has collided with a note.
     *
     * @param note The note to check for collision.
     * @return True if a collision occurred, false otherwise.
     */

    public boolean checkCollision(Note note) { // Method that checks if enemy has collided with note
        if (note.getNoteImage() != null && isEnemyActive) {
            double enemyCenterX = xCoord + ENEMY_IMAGE.getWidth() / 2.0;
            double enemyCenterY = yCoord + ENEMY_IMAGE.getHeight() / 2.0;

            // Calculate the center coordinates of the note
            double noteCenterX = note.getXCoord() + note.getNoteImage().getWidth() / 2.0;
            double noteCenterY = note.getYCoord() + note.getNoteImage().getHeight() / 2.0;

            double distance = Math.sqrt(Math.pow(enemyCenterX - noteCenterX, 2) + Math.pow(enemyCenterY - noteCenterY, 2));

            if (distance <= COLLISION_DISTANCE) {
                isEnemyActive = false;
            }
            return distance <= COLLISION_DISTANCE;
        } else {
            return false;
        }
    }


    /**
     * Gets the position of the enemy.
     *
     * @return The position of the enemy as a Point.
     */

    public Point getPosition() { // Getter for position of Enemy
        return new Point(xCoord, yCoord);
    }

    /**
     * Sets whether the enemy is active or not.
     *
     * @param enemyActive True if the enemy is active, false otherwise.
     */
    public void setIsEnemyActive(boolean enemyActive) { // Setter for if enemy is active
        isEnemyActive = enemyActive;
    }
}

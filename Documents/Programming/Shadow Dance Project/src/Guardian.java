import bagel.Image;
import bagel.util.Point;
import bagel.util.Vector2;

/**
 * The Guardian class represents a guardian character in the ShadowDance game.
 * The guardian can shoot arrows at the enemy to defend against incoming notes.
 * This class handles the drawing, shooting, and updating of the guardian and its arrow.
 */

public class Guardian {
    private Point guardianPosition = new Point(800, 600); // Starting Position for Guardian
    private final Image GUARDIAN_IMAGE = new Image("res/guardian.PNG"); // Image for the Guardian
    private Arrow currentArrow;  // New field to store the current arrow

    /**
     * Creates a new Guardian instance with a default starting position.
     */
    public Guardian() { // Constructor for Guardian Class
    }

    /**
     * Draws the guardian and its arrow if active.
     *
     * @param game The ShadowDance game instance.
     */

    public void draw(ShadowDance game) { // Method that draws the Guardian
        GUARDIAN_IMAGE.draw(guardianPosition.x, guardianPosition.y);
        if (currentArrow != null && currentArrow.isActive()) {
            currentArrow.draw(game.getEnemy());
        }
    }

    /**
     * Shoots an arrow from the guardian to the specified target position.
     *
     * @param targetPosition The position of the target (usually the enemy).
     */
    public void shootArrow(Point targetPosition) { // Guardian shoots arrow
        if (currentArrow == null || !currentArrow.isActive()) {
            // Create a new arrow only if the current one is null or not active
            currentArrow = new Arrow(guardianPosition);
        }

        // Calculate the vector from the guardian to the target
        Vector2 direction = new Vector2(targetPosition.x - guardianPosition.x, targetPosition.y - guardianPosition.y);

        // Calculate the angle of rotation
        double rotation = Math.atan2(direction.y, direction.x) + Math.PI / 2;

        // Shoot the arrow
        currentArrow.shoot(rotation, direction);
    }
    /**
     * Updates the arrow if it is active.
     *
     * @param game The ShadowDance game instance.
     */
    public void update(ShadowDance game) { // Updates arrow
        if (currentArrow != null && currentArrow.isActive()) {
            currentArrow.update(game.getEnemy());
        }
    }

    /**
     * Checks if the guardian's arrow is currently active.
     *
     * @return True if the arrow is active, false otherwise.
     */

    public boolean getArrowActive() { // Getter for if Arrow is Active
        if (currentArrow==null) {
            return false;
        }
        return (currentArrow.isActive());
    }
}

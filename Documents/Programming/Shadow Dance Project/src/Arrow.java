import bagel.DrawOptions;
import bagel.Image;
import bagel.util.Point;
import bagel.util.Vector2;


/**
 * The Arrow class represents an arrow projectile shot by the Guardian in the ShadowDance game.
 * This class handles the movement, collision detection, and drawing of the arrow.
 */

public class Arrow {
    private Point position; // Arrows Position
    private final Image ARROW_IMAGE = new Image("res/arrow.PNG"); // Image for Arrow
    private final int PROJECTILE_SPEED = 6; // Speed of Arrow
    private final int WINDOW_HEIGHT = 768;  // Adjust this according to your window dimensions
    private boolean isActive = true;
    private final double COLLISION_RADIUS = 62; // Distance between Enemy and

    /**
     * Creates a new Arrow instance with a specified starting position.
     *
     * @param startPosition The starting position of the arrow.
     */
    public Arrow(Point startPosition) { // Constructor for Arrow
        this.position = startPosition;
    }

    /**
     * Updates the arrow's position based on its relation to the enemy.
     *
     * @param targetEnemy The enemy that the arrow is targeting.
     */

    public void update(Enemy targetEnemy) { // Updates based on relation to Enemy
        if (isActive) {
            // Calculate the vector from the arrow to the enemy
            Vector2 direction = new Vector2(targetEnemy.getPosition().x - position.x, targetEnemy.getPosition().y - position.y);

            // Normalize the direction
            direction = direction.normalised();

            // Move the arrow in the direction of the enemy
            Vector2 movement = direction.mul(PROJECTILE_SPEED);
            position = position.asVector().add(movement).asPoint();

            // Check if arrow is out of the window or has hit the enemy
            if (position.y < 0 || position.y > WINDOW_HEIGHT) {
                isActive = false;
            }
            checkCollision(targetEnemy);
        }
    }

    /**
     * Checks if the arrow is still active.
     *
     * @return True if the arrow is active, false otherwise.
     */
    public boolean isActive() { // Getter for if Arrow is active
        return isActive;
    }

    /**
     * Draws the arrow image in relation to the enemy's position.
     *
     * @param enemy The enemy being targeted by the arrow.
     */

    public void draw(Enemy enemy) { // Draws the arrow image in relation to enemies position
        Vector2 directionToEnemy = new Vector2(enemy.getPosition().x - position.x, enemy.getPosition().y - position.y);
        double rotation = Math.atan2(directionToEnemy.y, directionToEnemy.x) + Math.PI / 2;
        if (isActive) {
            ARROW_IMAGE.draw(position.x, position.y, new DrawOptions().setRotation(rotation));
        }
    }

    /**
     * Checks if there is a collision with the enemy and deactivates both the arrow and the enemy if true.
     *
     * @param enemy The enemy being targeted by the arrow.
     */

    public void checkCollision(Enemy enemy) { // Checks if there is a collision with the Enemy
        if (isActive) {
            double distance = position.distanceTo(enemy.getPosition());
            if (distance <= COLLISION_RADIUS) {
                enemy.setIsEnemyActive(false);
                isActive = false;
            }
        }
    }

    /**
     * Shoots the arrow in a specified direction and updates its position.
     *
     * @param rotation  The rotation angle of the arrow.
     * @param direction The direction in which the arrow should move.
     */
    public void shoot(double rotation, Vector2 direction) {
        // Set the arrow's rotation and direction
        ARROW_IMAGE.draw(position.x, position.y, new DrawOptions().setRotation(rotation));

        // Move the arrow in the direction of the target
        Vector2 movement = direction.normalised().mul(PROJECTILE_SPEED);
        position = position.asVector().add(movement).asPoint();
    }

}

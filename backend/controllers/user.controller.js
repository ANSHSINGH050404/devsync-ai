export const createUserController = async (req, res) => {
    const errors = validationResult(req);

    // 1️⃣ Handle validation errors early
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // 2️⃣ If no validation errors → proceed
    try {
        const user = await userService.createUser(req.body);
        const token = await user.generateJWT();
        return res.status(201).json({ user, token });
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

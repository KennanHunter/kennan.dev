---
title: How to Modularize your FTC Codebase into Subsystems
description: Learn how to use Subsystems to de-spaghetti your FTC codebase.
pubDate: 2022-07-02

archiveReason: FTC Has changed a lot since 2022. Nothing here is wrong, but take a look at gm0, ftclib, pedro pathing, or roadrunner.
archiveDate: 2024-12-12
---

[Skip Explanation](#creating-a-simple-hardware-based-subsystem)

# The problem

Anyone who's put much time into programming for [First Tech Challenge](https://www.firstinspires.org/robotics/ftc) is familiar with the eventual unmaintainability that comes with the standard teleop structure.

Looking at the source code for my 2020-2021 team, there are roughly 17 OpModes. Every single one of these programs themselves contain roughly 100 lines of copy and pasted _boilerplate_ with everything from confusingly named configuration variables to successive
`hardwareMap.get()`
calls.

This sort of project architecture while simple, shows its problems as the season goes on, and you find yourself dealing with hundred of lines of gibberish. **Finding what you want to edit becomes as difficult of a challenge as editing it.**

# Options

There are a few main ways you can split up your FTC code

1. ### Functions

```java {18-20} showLineNumbers
@Autonomous(name = "Function Example")
class FunctionExample extends LinearOpMode {

	private DcMotor motor;

	@Override
	public void runOpMode() {
		motor =
			hardwareMap.get(
				DcMotor.class,
				"Have fun synchronizing this string across 10 op modes"
			);

		waitForStart();
		forward();
	}

	private void forward() {
		motor.setPower(1.0);
	}
}

```

Functions (or more accurately teleop methods) can be a great first step to reusable code, and I highly recommend them to any programmers I'm introducing to FTC, but they fall flat on a few points.

- They must live in the same file as the OpMode that is using them
- They leave hardware allocation to whatever OpMode they accompany introducing "Magic Strings" which need to be manually synchronized for every OpMode

2. ### Finite State Machines

Finite State Machines are arguably the most elegant way to describe an ftc robot, but for most use cases, they are overcomplicated.
Finite State Machines shine when you need to apply complex logic/algorithms (such as PID or Feed-Forward) to whatever hardware they encapsulate.

[Game Manual 0 has a great article on Finite State Machines.](https://gm0.org/en/latest/docs/software/finite-state-machines.html)

I implore you to see if Subsystems work for your use case. Finite State Machines also work as the internal logic for a Subsystem, making a unified interface to your robot.

3. ### Subsystems

This tutorial is going to cover the use of Subsystems due to the various benefits they come with.

- Subsystems live in their own file, and are easy to use in other OpModes, ensuring that hardware changes don't break existing code
- Subsystems methods (functions) live with their hardware definitions
- `Hardwaremap.get()` calls for each piece of hardware exist in one spot, ensuring that you only have to worry about updating one string when you update your Control Hub's hardware map

# Creating a simple hardware based Subsystem

Lets start by making a new folder for your subsystems. Despite how simple this sounds, many FTC programmers decide to throw everything at the top of their `TeamCode` folder, making their code harder to read and understand.

Go into your TeamCode folder and right click on it. Then go `New > Package`. When the dialogue pops up type `subsystem`.

Finally in your new folder right click and go `New > Java Class`. It will give you a dialogue, type in the name of your Subsystem, for this tutorial it will be `Drive`.

At this point you should have a file that looks like this.

```java
package org.firstinspires.ftc.teamcode.subsystem;

public class Drive {}

```

Now we're going to start describing our hardware. Much like in a standard OpMode we can create a few variables for our motors. Because this is the drive subsystem, we only want to describe the hardware that is directly related to driving.

Note: Code examples don't include import statements, you should be using Android Studio's code suggestions to automatically add them.

```java
public class Drive {

	public DcMotor leftFront;
	public DcMotor leftRear;
	public DcMotor rightRear;
	public DcMotor rightFront;
}

```

At this point you might be itching to add a `runOpMode` or `init` method like you would in an OpMode. However this is a custom class, not an op mode, meaning we don't have those methods for use. Instead, lets use a class constructor.

A class constructor is a method that gets called when a class is initially created.

```java
public class Drive {

	public DcMotor leftFront;
	public DcMotor leftRear;
	public DcMotor rightRear;
	public DcMotor rightFront;

	public Drive() {}
}

```

Notice a few things about this constructor,

1. It does not specify a return type
2. It has the same name as the class

Inside this constructor we're going to put our hardware map calls

```java
public class Drive {

	public DcMotor leftFront;
	public DcMotor leftRear;
	public DcMotor rightRear;
	public DcMotor rightFront;

	public Drive() {
		//! This doesn't work
		leftFront = hardwareMap.get(DcMotor.class, "leftFront");
	}
}

```

If you put this code into android studio, you'll get a big red indicator at `hardwareMap`. Why? `hardwareMap` is a variable that exists on OpMode. If you're interested, go to an op mode and `ctrl+left-click` on the `LinearOpMode` in the `extends LinearOpMode` syntax at the top of the file. You'll see all the variables that exist on `LinearOpMode`. Some of these variables are stuff like `telemetry`, `gamepad1`, and `gamepad2`. Learning these will help you understand what is really going on when you make an OpMode.

In order to make this work, we're going to pass the `hardwareMap` from our OpMode, to our subsystem. Put "HardwareMap hardwareMap" in the parameters for your class constructor.

```java
// Because its a type, we have to import it
import com.qualcomm.robotcore.hardware.HardwareMap;

public class Drive {

	// ...
	public Drive(HardwareMap hardwareMap) {
		//           ^ Type      ^ Name for value
		leftFront = hardwareMap.get(DcMotor.class, "leftFront");
		leftRear = hardwareMap.get(DcMotor.class, "leftRear");
		rightRear = hardwareMap.get(DcMotor.class, "rightRear");
		rightFront = hardwareMap.get(DcMotor.class, "rightFront");
	}
}

```

This syntax is a bit wacky but lets break it down a bit. `HardwareMap` with a capital at the beginning of it is the type of the value, while `hardwareMap` with a lowercase at the beginning is the name we use to reference it. This falls in line with the FTC sdk's naming scheme.

We also add the remaining motor's `hardwareMap` calls.

Finally we want to include some of our configuration for this hardware. This can be stuff like encoders, zero power behavior, led patterns, etc. Here we reverse the right motors.

```java
public class Drive {

	// ...
	public Drive(HardwareMap hardwareMap) {
		leftFront = hardwareMap.get(DcMotor.class, "leftFront");
		leftRear = hardwareMap.get(DcMotor.class, "leftRear");
		rightRear = hardwareMap.get(DcMotor.class, "rightRear");
		rightFront = hardwareMap.get(DcMotor.class, "rightFront");

		rightFront.setDirection(DcMotorSimple.Direction.REVERSE);
		rightRear.setDirection(DcMotorSimple.Direction.REVERSE);
	}
}

```

# Adding Methods

Underneath our class constructor we're going to add a method to our subsystem. We can directly call our motors.

```java
public class Drive {

	public DcMotor leftFront;
	public DcMotor leftRear;
	public DcMotor rightRear;
	public DcMotor rightFront;

	public Drive(HardwareMap hardwareMap) {
		// ...
	}

	public void Forward(double power) {
		leftFront.setPower(power);
		leftRear.setPower(power);
		rightFront.setPower(power);
		rightRear.setPower(power);
	}
}

```

In our `Forward` method we pass in a double named "power" which determines the power of our motor.

# Configuration Variables

One last thing we might want to do is include configuration variables in our subsystem. This ensures that certain hardware specific variables remain isolated from our OpModes.

```java
public class Drive {
	//...
	final double MAX_SPEED = 1.0;

	//...

	public void Forward(double p) {
		double power = p * MAX_SPEED
		leftFront.setPower(power);
		leftRear.setPower(power);
		rightFront.setPower(power);
		rightRear.setPower(power);
	}
}
```

Because we don't need to change configuration variables, we annotate the variable with final, instead of public or private. This helps the java compiler optimize our code, and ensures we don't have unintended functionality. It's also common practice in java to name our static variables all uppercase, with underscores between the words.

# Using Your Subsystem in an OpMode

Create a new OpMode, in our example we're going to use an Autonomous.

```java
@Autonomous(name = "Subsystems r c00l")
public class SubsystemExample extends LinearOpMode {

	@Override
	public void runOpMode() {
		waitForStart();
	}
}

```

Add the subsystem variable, much like you would do a motor. In your `runOpMode()` method create the drive subsystem. This takes the place of your `hardwareMap.get()` call. After your `waitForStart()`, we actually start the Autonomous. Finally we can put our `forward()` method call.

```java
// Android Studio should do this import automatically
import org.firstinspires.ftc.teamcode.subsystem.Drive;

@Autonomous(name = "Subsystems r c00l")
public class SubsystemExample extends LinearOpMode {

	public Drive drive;

	@Override
	public void runOpMode() {
		drive = new Drive(hardwareMap);
		waitForStart();
		drive.forward(1.0)
	}
}

```

# Conclusion

Subsystems are a great way to start modularizing your FTC code. If you're looking for more code examples, including using subsystems with sensors and vision pipelines, I'll direct you to my [2021-2022 source code](https://github.com/FTC-701-North-Robotics/701-robot-controller-2021-2022/tree/main/TeamCode/src/main/java/org/firstinspires/ftc/teamcode/subsystem).

# mp4-converter

> Automatically convert video files to mp4 files suitable for Apple TV 3 or higher, iPad and iPhone.

This is a small pet project to automate the process of adding videos to my iTunes collection.

## What it does

The code will run in the background as a daemon.

It will watch the `input` folder for new video files and will automatically add these files to a queue.

It will convert the files in the queue, using the `working` folder to save the partially converted mp4 file during transcoding.

When complete the converted file will be moved to the `output` folder and the file being converted will be moved to the `processed` folder. A useful output folder to use might be the `Automatically Add To iTunes` folder inside your iTunes music library.

If a `.srt` file is added with the same name as the video file it will be used as the subtitles file for the video. Otherwise all subtitles found in the original file will be included in the converted file.

## How to use it

### Dependencies

- Nodejs (tested with 4.2.2)
- Npm (tested with 2.14.7)

### Installing
Install the nodejs dependencies:

```
npm install
```

Configure using `config.json`. An example configuration file looks like this:

```
{
    "input": "test/input",
    "output": "test/output",
    "processed": "test/processed",
    "working": "test/working"
}
```

### Using
Start the daemon by running:

```
npm start
```

Stop the daemon by running:

```
npm stop
```

View the logs by running:

```
npm run-script log
```

### Partially Converting Files
It is sometimes useful to convert a section of a file rather then the entire file, for example when testing the converter. The converter can be instructed to partially convert a file by adding `##partial##[start index in seconds]##[duration in seconds]##` into the file name. For example `##partial##120##60##` will result in a converted file 60 seconds in duration, starting at 120 seconds in the input file.

This addition to the filename should be added at the end of the filename, for example if the original file name is `my-video.mkv` (a 30 minute video), and you wanted to convert the 10 minutes of this video starting at 5 minutes, the filename to achieve this would be `my-video##partial##300##600##.mkv`.

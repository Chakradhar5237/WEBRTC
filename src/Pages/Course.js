import { useState, useRef, useEffect } from "react";
import "./Course.css"; // Custom styles

const videoCourses = [
  { title: "React Basics", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { title: "Advanced React", url: "https://www.w3schools.com/html/movie.mp4" },
  { title: "UI/UX Design", url: "https://www.w3schools.com/html/mov_bbb.mp4" }
];

export function Courses() {
  const [selectedVideo, setSelectedVideo] = useState(videoCourses[0]);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      const videoElement = videoRef.current;
  
      // Load the new source
      videoElement.load();
  
      // Play only after data is loaded
      const handleLoadedData = () => {
        videoElement.play().catch((error) => {
          console.log("Autoplay failed:", error.message);
        });
      };
  
      videoElement.addEventListener("loadeddata", handleLoadedData);
  
      // Cleanup
      return () => {
        videoElement.removeEventListener("loadeddata", handleLoadedData);
      };
    }
  }, [selectedVideo]);

  return (
    <div className="courses-container">
      <h2 className="courses-title">Courses</h2>

      <div className="courses-list">
        {videoCourses.map((course, index) => (
          <button
            key={index}
            onClick={() => setSelectedVideo(course)}
            className={`course-button ${selectedVideo.title === course.title ? "active" : ""}`}
          >
            {course.title}
          </button>
        ))}
      </div>

      <div className="video-section">
        <h3 className="video-title">Now Playing: {selectedVideo.title}</h3>
            <div className="video-wrapper">
            <video ref={videoRef} className="video-player" controls>
            <source src={selectedVideo.url} type="video/mp4" />
            Your browser does not support the video tag.
            </video>
            </div>
        </div>

    </div>
  );
}

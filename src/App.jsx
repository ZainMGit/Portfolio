import { useEffect, useState } from 'react';
import Aurora from './Aurora';
import PillNav from './PillNav';
import GlareHover from './GlareHover';

const projects = [
  {
    id: 'modalZainlink',
    image: 'zainlink_home.png',
    title: 'ZainLink URL Shortener',
    subtitle: 'Full-Stack Web Application'
  },
  {
    id: 'modal0',
    image: 'rocket_board.jpg',
    title: 'FNL Rocketry Payload',
    subtitle: 'Custom Arduino Payload for Rocketry'
  },
  {
    id: 'modal3',
    image: 'PCB_Layout.png',
    title: 'PCB Design Project',
    subtitle: 'Digital Coin Toss Circuit'
  },
  {
    id: 'modal4',
    image: 'breadboardpic.png',
    title: 'Circuit Design Project',
    subtitle: 'Logic Circuit Implementation'
  }
];

export default function App() {
  const [activeModal, setActiveModal] = useState(null);
  const imageUrl = (file) => `${import.meta.env.BASE_URL}images/${file}`;

  useEffect(() => {
    document.body.style.overflow = activeModal ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [activeModal]);

  return (
    <>
      <header className="site-header">
        <div className="top-nav">
          <div className="logo">Zain Mustafa</div>
          <PillNav
            logo={imageUrl('github-icon.png')}
            logoAlt="Zain Mustafa Logo"
            items={[
              { label: 'Home', href: '#home' },
              { label: 'About', href: '#about' },
              { label: 'Projects', href: '#projects' },
              {
                label: 'Resume',
                href: 'https://docs.google.com/document/d/1OLUcIip3HopUhFJs7bz1wGKWwrrWz4WAZa19wzxIrdM/edit?usp=sharing',
                target: '_blank',
                rel: 'noopener noreferrer'
              }
            ]}
            activeHref="#home"
            className="custom-nav"
            ease="power2.easeOut"
            baseColor="#0b1221"
            pillColor="#122038"
            hoveredPillTextColor="#dff6ff"
            pillTextColor="#9cc9ff"
            theme="light"
            initialLoadAnimation={false}
          />
        </div>
      </header>

      <main>
        <section id="home" className="landing">
          <Aurora colorStops={['#7cff67', '#B19EEF', '#5227FF']} blend={0.5} amplitude={1.0} speed={2.5} />
          <div className="landing-content">
            <h2>Welcome to My Portfolio</h2>
            <p>I'm Zain Mustafa, an electrical engineering student passionate about building systems from hardware to full-stack software.</p>
            <div className="social-icons">
              <a href="https://github.com/ZainMGit" target="_blank" rel="noreferrer"><img src={imageUrl('github-icon.png')} alt="GitHub" /></a>
              <a href="https://www.linkedin.com/in/zain-a-mustafa/" target="_blank" rel="noreferrer"><img src={imageUrl('linkedin-icon.png')} alt="LinkedIn" /></a>
              <a href="mailto:zain.a.mustafa@gmail.com"><img src={imageUrl('email-icon.png')} alt="Email" /></a>
            </div>
          </div>
        </section>

        <section id="about" className="about">
          <div className="about-section">
            <div className="about-container">
              <img src={imageUrl('about-image.jpg')} alt="Zain" className="about-img" />
              <div className="about-text">
                <h2>I'm Zain Mustafa</h2>
                <p>
                  As an electrical engineering student at UC Davis, I have developed a strong basis in the theoretical and practical aspects of engineering.
                  In my time as the electrical lead for the First Nations Launch Rocketry Team, I designed and implemented systems utilizing microcontrollers
                  to collect and store data from multiple sensors on a rocket.
                </p>
                <p>
                  This role honed my programming and data analysis skills. Additionally, in my role at the UC Davis School of Law, I have learned technical
                  troubleshooting abilities, task prioritization, and effective team communication in fast-paced environments.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="section">
          <div className="skills-card">
            <h2>Skills &amp; Software</h2>
            <ul className="skills-list">
              {['Altium Designer', 'C/C++', 'KiCAD', 'Fusion360', 'MATLAB', 'NI Multisim', 'PCB Design', 'Soldering', 'RockSim & OpenRocket', 'Python', 'ServiceNow', 'MongoDB Atlas'].map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="projects" className="projects">
          <h2>Featured Projects</h2>
          <div className="project-images">
            {projects.map((project) => (
              <GlareHover
                key={project.id}
                className="project-card"
                width="100%"
                height="100%"
                background="rgba(16, 27, 46, 0.88)"
                borderRadius="16px"
                borderColor="rgba(102, 158, 255, 0.22)"
                glareColor="#ffffff"
                glareOpacity={0.24}
                glareAngle={-30}
                glareSize={260}
                transitionDuration={780}
                playOnce={false}
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveModal(project.id)}
                onKeyDown={(e) => (e.key === 'Enter' ? setActiveModal(project.id) : null)}
                role="button"
                tabIndex={0}
              >
                <div className="project-image"><img src={imageUrl(project.image)} alt={project.title} /></div>
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p>{project.subtitle}</p>
                </div>
                <div className="project-link"><a href="#" onClick={(e) => e.preventDefault()}>Learn More</a></div>
              </GlareHover>
            ))}
          </div>
        </section>

        {activeModal === 'modalZainlink' && (
          <Modal onClose={() => setActiveModal(null)}>
            <div className="modal-images">
              <img src={imageUrl('zainlink_dashboard.png')} alt="ZainLink Dashboard" />
              <img src={imageUrl('zainlink_home.png')} alt="ZainLink Home" />
              <img src={imageUrl('login.png')} alt="ZainLink Login" />
            </div>
            <div className="modal-text">
              <h2>ZainLink: Full-Stack URL Shortener</h2>
              <p><em>Purpose:</em> Personal Project</p>
              <p><em>Duration:</em> May 2024 - Ongoing</p>
              <p><strong>Objective:</strong>  ZainLink is a full-stack web application designed to securely shorten URLs with optional custom aliases. The website features include CAPTCHA protection, user authentication, and a live dashboard for managing links which the user has created. There is also an admin account which can manage all links created by other users straight from the dashboard on the website.

I handled both the frontend and backend architecture. The backend is built using the python framework Flask and connected to a MongoDB Atlas database. For deployment, I used Render for backend hosting and IONOS to point a custom domain (zainlink.com) to the app using DNS records. The frontend is built with HTML and CSS. I also added Google Analytics tracking to measure real user engagement.</p>
              <hr />
              <h4>Skills/Software Used</h4>
              <ul>
                <li>HTML/CSS</li>
                <li>Flask (Python)</li>
                <li>MongoDB Atlas</li>
                <li>CAPTCHA Integration</li>
                <li>Google Analytics</li>
                <li>Render &amp; IONOS DNS</li>
              </ul>
              <div className="modal-links">
                <a className="modal-btn" href="https://zainlink.com" target="_blank" rel="noreferrer">Live Website</a>
                <a className="modal-btn" href="https://github.com/ZainMGit/ZainLink" target="_blank" rel="noreferrer">GitHub</a>
              </div>
            </div>
          </Modal>
        )}

                {activeModal === 'modal0' && (
          <Modal onClose={() => setActiveModal(null)}>
            <div className="modal-images">
              <img src={imageUrl('rocket_board.jpg')} alt="Electronics Board" />
              <img src={imageUrl('rocket_payload.jpg')} alt="Payload Assembly" />
              <img src={imageUrl('rocket_launch.jpg')} alt="Rocket Launch" />
            </div>
            <div className="modal-text">
              <h2>Rocketry Payload Electronics</h2>
              <p><em>Purpose:</em> First Nations Launch Rocketry Competition</p>
              <p><em>Duration:</em> Oct 2024 - April 2025</p>
              <p><strong>Objective:</strong> The First Nations Launch (FNL) is a NASA-sponsored high-powered rocketry competition where teams must design, build, and launch rockets with scientific payloads. This year's payload specifications required us to create a payload system to record environmental data and demonstrate real-time onboard sensing.</p>
              <p>As the Payload Lead, I decided putting an atmospheric pressure and a 9 degrees of freedom sensor into our rocket. I programmed and calibrated the BMP280 sensor for pressure/altitude data, the ISM330DHCX sensor for acceleration and gyroscope data, and the MMC5983MA sensor for magnetometer measurements. I led breadboarding and final assembly of the electronics payload where I coordinated with the avionics team to ensure proper fit and thermal safety.</p>
              <p>I had to conduct extensive ground testing and debugging to ensure the payload could handle real launch conditions without crashing or corrupting data. We also had two testing launches of the payload bay before the competition date where I made revisions to the payload after each test. After these test launches I created MATLAB scripts to plot the data which the sensors were collecting after launch. I delivered detailed technical write-ups and system diagrams for the competition through the different phases of development for the rocket.</p>
              <hr />
              <h4>Skills/Software Used</h4>
              <ul>
                <li>MATLAB</li>
                <li>Arduino Programming (C++)</li>
                <li>Sensor Integration (I2C)</li>
                <li>RockSim &amp; OpenRocket</li>
              </ul>
            </div>
          </Modal>
        )}
        {activeModal === 'modal3' && (
          <Modal onClose={() => setActiveModal(null)}>
            <div className="modal-images">
              <img src={imageUrl('PCB_Layout.png')} alt="PCB Layout" />
              <img src={imageUrl('PCB_Finished.png')} alt="Finished PCB" />
            </div>
            <div className="modal-text">
              <h2>PCB Design Project</h2>
              <p><em>Course:</em> Digital Electronics</p>
              <p><em>Duration:</em> March 2024</p>
              <p><strong>Objective:</strong> This was an individual project and I decided to create a coin flipper that gives one of two outcomes randomly. To begin this project I first created a proof of concept by bread boarding the design and creating it on a simulation software called Multisim. Then I created the PCB design on Fusion 360 manually connecting and placing all of the components how I wanted them on the board. After printing this layout on a mask I transferred the mask onto a copper board using an iron. Then after washing away the excess copper using ferric chloride, I drilled holes in all of the places where I would place my components. Then I soldered all of the components to the board. This project challenged me to use my prior knowledge to create a brand-new circuit. During the project, I encountered some challenges. For example, during the creation of the PCB layout I had to figure out a format that would involve the least amount of jumper wires. I enjoyed working on the project and it gave me experience with creating a PCB circuit from scratch.</p>
              <hr />
              <h4>Skills/Software Used</h4>
              <ul>
                <li>Fusion360</li>
                <li>Soldering</li>
                <li>NI Multisim</li>
                <li>PCB Design</li>
              </ul>
            </div>
          </Modal>
        )}

                {activeModal === 'modal4' && (
          <Modal onClose={() => setActiveModal(null)}>
            <div className="modal-images">
              <img src={imageUrl('breadboardpic.png')} alt="Breadboard Circuit" />
              <img src={imageUrl('combinationalogicMultisim.png')} alt="Multisim Diagram" />
            </div>
            <div className="modal-text">
              <h2>Circuit Design Project</h2>
              <p><em>Course:</em> Digital Electronics</p>
              <p><em>Duration:</em> October 11, 2023 - October 21, 2023</p>
              <p><strong>Objective:</strong> The purpose and goal of the project was to create a circuit that solves a problem utilizing both combinational and sequential logic. Our project needed at least three inputs and one output. We created an automated soccer referee system that determines whether a foul is a red or yellow card. I was specifically tasked with completing the combinational logic portion of both the Multisim simulation and breadboard. This challenged me to implement my understanding of AOI logic components into a practical scenario. We began the project by listing all inputs and outputs needed to function. I created a truth table and a system of logic gates to meet desired outputs. I simplified gate use for easier completion in Multisim. Overall, I enjoyed this project and gained real-world circuit design experience.</p>
              <hr />
              <h4>Skills/Software Used</h4>
              <ul>
                <li>Logic Gates</li>
                <li>NI Multisim</li>
                <li>Breadboarding</li>
              </ul>
            </div>
          </Modal>
        )}
      </main>

      <footer className="footer">
        <div className="footer-links">
          <a href="https://www.linkedin.com/in/zain-a-mustafa/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://github.com/ZainMGit" target="_blank" rel="noreferrer">GitHub</a>
          <a href="mailto:zain.a.mustafa@gmail.com">Contact</a>
        </div>
        <p>&copy; 2026 Zain Mustafa</p>
      </footer>
    </>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>&times;</span>
        {children}
      </div>
    </div>
  );
}


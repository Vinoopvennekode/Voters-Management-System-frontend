import React, { useState } from "react";
import VotingDay from "./VotingDay";
import VoterTable from "./VoterTable";

const VotingTabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState("votingDay");

    return (
        <div className="container mt-4">
            {/* Bootstrap Tabs */}
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "votingDay" ? "active" : ""}`}
                        onClick={() => setActiveTab("votingDay")}
                    >
                        🗳️ Voting Day Panel
                    </button>
                </li>

                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "table" ? "active" : ""}`}
                        onClick={() => setActiveTab("table")}
                    >
                        📋 Voter Table (Filters)
                    </button>
                </li>
            </ul>

            {/* Tab Content */}
            <div className="tab-content mt-3">
                {activeTab === "votingDay" && (
                    <div className="tab-pane fade show active">
                        <VotingDay />
                    </div>
                )}

                {activeTab === "table" && (
                    <div className="tab-pane fade show active">
                        <VoterTable />
                    </div>
                )}
            </div>
        </div>
    );
};

export default VotingTabs;
